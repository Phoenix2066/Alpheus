import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';
import { getSigner, isSepolia, switchNetwork } from '../utils/ethers';
import { getFactoryContract } from '../utils/contracts';
import { Plus, Trash2, Loader2, CheckCircle, ExternalLink } from 'lucide-react';

const DURATIONS = [
  { label: 'Demo (1 min cliff / 5 min vest)', cliff: 60, vesting: 300 },
  { label: '6 Months Cliff / 1 Year Vest', cliff: 15552000, vesting: 31104000 },
  { label: '1 Year Cliff / 2 Years Vest', cliff: 31104000, vesting: 62208000 },
  { label: '1 Year Cliff / 4 Years Vest', cliff: 31104000, vesting: 124416000 },
];

const Deploy = ({ account }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    totalSupply: '',
    durationIdx: 0,
    beneficiaries: [{ address: '', amount: '' }]
  });

  const handleAddBeneficiary = () => {
    setFormData({
      ...formData,
      beneficiaries: [...formData.beneficiaries, { address: '', amount: '' }]
    });
  };

  const handleRemoveBeneficiary = (index) => {
    const newBeneficiaries = formData.beneficiaries.filter((_, i) => i !== index);
    setFormData({ ...formData, beneficiaries: newBeneficiaries });
  };

  const handleBeneficiaryChange = (index, field, value) => {
    const newBeneficiaries = [...formData.beneficiaries];
    newBeneficiaries[index][field] = value;
    setFormData({ ...formData, beneficiaries: newBeneficiaries });
  };

  const totalAllocated = formData.beneficiaries.reduce((sum, b) => {
    const val = parseFloat(b.amount) || 0;
    return sum + val;
  }, 0);

  const remainingSupply = (parseFloat(formData.totalSupply) || 0) - totalAllocated;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return;
    
    setLoading(true);
    try {
      if (!(await isSepolia())) {
        await switchNetwork();
      }

      const signer = await getSigner();
      const factory = getFactoryContract(signer);

      const { name, symbol, totalSupply, durationIdx, beneficiaries } = formData;
      const duration = DURATIONS[durationIdx];

      const bAddresses = beneficiaries.map(b => b.address);
      const bAmounts = beneficiaries.map(b => ethers.parseUnits(b.amount.toString(), 18));
      const supplyWei = ethers.parseUnits(totalSupply.toString(), 18);

      const tx = await factory.deployToken(
        name,
        symbol,
        supplyWei,
        bAddresses,
        bAmounts,
        duration.cliff,
        duration.vesting
      );

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);
      
      // Find event
      const event = receipt.logs.find(log => {
          try {
              const parsed = factory.interface.parseLog(log);
              return parsed && parsed.name === 'TokenDeployed';
          } catch(e) { return false; }
      });
      
      if (!event) throw new Error("TokenDeployed event not found in logs");

      const parsedLog = factory.interface.parseLog(event);
      const tokenAddress = parsedLog.args.tokenAddress;

      if (!tokenAddress) throw new Error("Could not retrieve token address from logs");
      if (!account) throw new Error("Wallet account not found");

      // Save to backend
      const payload = {
        tokenAddress: tokenAddress.toLowerCase(),
        deployerWallet: account.toLowerCase(),
        name,
        symbol,
        totalSupply: totalSupply.toString(),
        beneficiaryCount: beneficiaries.length,
        cliffDuration: duration.cliff,
        vestingDuration: duration.vesting,
        txHash: receipt.hash
      };

      console.log("Sending payload to backend:", payload);

      await axios.post('http://localhost:5000/api/tokens', payload);

      setSuccess({
        address: tokenAddress,
        txHash: receipt.hash
      });
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Deployment failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-2xl">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Token Deployed!</h2>
          <p className="text-slate-500 mb-8">Your vested ERC-20 token is live on Sepolia.</p>
          
          <div className="space-y-4 mb-10">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left">
              <span className="text-xs text-slate-400 block mb-1">Token Address</span>
              <code className="text-sm font-mono break-all">{success.address}</code>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-8 py-3 bg-accent text-white font-bold rounded-xl"
            >
              Go to Dashboard
            </button>
            <a
              href={`https://sepolia.etherscan.io/tx/${success.txHash}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 px-8 py-3 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl flex items-center justify-center gap-2"
            >
              View Transaction <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <h1 className="text-4xl font-display font-bold mb-8 text-center">Deploy Your Vested Token</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">Token Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alpheus River"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-accent outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Token Symbol</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="ALP"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-accent outline-none uppercase"
                  value={formData.symbol}
                  onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Total Supply</label>
              <input
                required
                type="number"
                placeholder="1,000,000"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-accent outline-none"
                value={formData.totalSupply}
                onChange={e => setFormData({...formData, totalSupply: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Vesting Schedule</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-accent outline-none"
                value={formData.durationIdx}
                onChange={e => setFormData({...formData, durationIdx: parseInt(e.target.value)})}
              >
                {DURATIONS.map((d, i) => (
                  <option key={i} value={i}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-bold">Beneficiaries</label>
                <button
                  type="button"
                  onClick={handleAddBeneficiary}
                  className="flex items-center gap-2 text-accent font-bold text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Another
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.beneficiaries.map((b, i) => (
                  <div key={i} className="flex gap-4 items-end">
                    <div className="flex-[3]">
                      <label className="text-xs font-bold text-slate-400 mb-1 block">Wallet Address</label>
                      <input
                        required
                        type="text"
                        placeholder="0x..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                        value={b.address}
                        onChange={e => handleBeneficiaryChange(i, 'address', e.target.value)}
                      />
                    </div>
                    <div className="flex-[1]">
                      <label className="text-xs font-bold text-slate-400 mb-1 block">Amount</label>
                      <input
                        required
                        type="number"
                        placeholder="1000"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm"
                        value={b.amount}
                        onChange={e => handleBeneficiaryChange(i, 'amount', e.target.value)}
                      />
                    </div>
                    {formData.beneficiaries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBeneficiary(i)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={loading || !account || remainingSupply < 0}
              className="w-full py-4 bg-accent text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Vested Token"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-3xl sticky top-24 border border-slate-100 dark:border-slate-700">
            <h3 className="text-xl font-bold mb-6">Live Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Token</span>
                <span className="font-bold">{formData.symbol || '---'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Total Supply</span>
                <span className="font-bold">{formData.totalSupply || '0'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Allocated</span>
                <span className="font-bold">{totalAllocated}</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-700 my-4" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Remaining</span>
                <span className={`text-xl font-display font-bold ${remainingSupply < 0 ? 'text-red-500' : 'text-accent'}`}>
                  {remainingSupply}
                </span>
              </div>
              {remainingSupply < 0 && (
                <p className="text-xs text-red-500 font-medium mt-2 italic text-right">
                  Error: Allocated exceeds supply
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deploy;
