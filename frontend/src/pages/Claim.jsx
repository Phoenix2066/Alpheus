import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { getProvider, getSigner, isSepolia, switchNetwork } from '../utils/ethers';
import { getTokenContract } from '../utils/contracts';
import { Loader2, Coins, Clock, Lock, CheckCircle2 } from 'lucide-react';

const Claim = ({ account }) => {
  const [searchParams] = useSearchParams();
  const [address, setAddress] = useState(searchParams.get('address') || '');
  const [tokenData, setTokenData] = useState(null);
  const [vestingInfo, setVestingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const fetchData = async () => {
    if (!ethers.isAddress(address) || !account) return;

    try {
      setLoading(true);
      const provider = getProvider();
      const contract = getTokenContract(address, provider);

      const [name, symbol, decimals, schedule, claimable, vested] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.vestingSchedules(account),
        contract.claimable(account),
        contract.vestedAmount(account)
      ]);

      setTokenData({ name, symbol, decimals: Number(decimals) });
      setVestingInfo({
        total: schedule.totalAmount,
        startTime: Number(schedule.startTime),
        cliff: Number(schedule.cliffDuration),
        duration: Number(schedule.vestingDuration),
        claimed: schedule.claimed,
        claimable,
        vested
      });
    } catch (err) {
      console.error(err);
      setTokenData(null);
      setVestingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address, account]);

  const handleClaim = async () => {
    if (!account || !address) return;
    setClaiming(true);
    try {
      if (!(await isSepolia())) {
        await switchNetwork();
      }
      const signer = await getSigner();
      const contract = getTokenContract(address, signer);
      const tx = await contract.claim();
      await tx.wait();
      fetchData();
      alert("Tokens claimed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.reason || err.message || "Claim failed");
    } finally {
      setClaiming(false);
    }
  };

  const calculateProgress = () => {
    if (!vestingInfo) return 0;
    const progress = (Number(vestingInfo.vested) / Number(vestingInfo.total)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold mb-4 text-center">Claim Portal</h1>
        <p className="text-slate-500">Enter a token address to check your vesting schedule and claim unlocked tokens.</p>
        
        <div className="mt-8 max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Enter Token Address (0x...)"
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-accent transition-all text-center font-mono"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
      </div>

      {!account ? (
        <div className="text-center p-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500">Please connect your wallet to view vesting details.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
        </div>
      ) : tokenData && vestingInfo && vestingInfo.total > 0 ? (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard 
              icon={<Coins className="w-5 h-5 text-blue-500" />}
              label="Total Allocation"
              value={`${ethers.formatUnits(vestingInfo.total, tokenData.decimals)} ${tokenData.symbol}`}
            />
            <StatCard 
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              label="Vested So Far"
              value={`${ethers.formatUnits(vestingInfo.vested, tokenData.decimals)} ${tokenData.symbol}`}
            />
            <StatCard 
              icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
              label="Already Claimed"
              value={`${ethers.formatUnits(vestingInfo.claimed, tokenData.decimals)} ${tokenData.symbol}`}
            />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 lg:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div>
                <span className="text-sm font-bold text-accent uppercase tracking-wider mb-2 block">Available to Claim</span>
                <h2 className="text-5xl font-display font-bold">
                  {ethers.formatUnits(vestingInfo.claimable, tokenData.decimals)} <span className="text-2xl text-slate-400 font-normal">{tokenData.symbol}</span>
                </h2>
              </div>
              <button
                disabled={claiming || vestingInfo.claimable == 0}
                onClick={handleClaim}
                className="px-10 py-5 bg-accent text-white font-bold rounded-2xl hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
              >
                {claiming ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Coins className="w-6 h-6" /> Claim Tokens</>}
              </button>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold">Vesting Progress</span>
                <span className="text-sm font-bold text-accent">{calculateProgress().toFixed(2)}%</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-1000 ease-out"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              <div className="flex justify-between mt-4 text-xs font-medium text-slate-400">
                <span>Start: {new Date(vestingInfo.startTime * 1000).toLocaleDateString()}</span>
                <span>Cliff: {new Date((vestingInfo.startTime + vestingInfo.cliff) * 1000).toLocaleDateString()}</span>
                <span>Ends: {new Date((vestingInfo.startTime + vestingInfo.duration) * 1000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : address && (
        <div className="text-center p-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No vesting schedule found for your address on this token.</p>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
    <div className="flex items-center gap-3 mb-3 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
      {icon}
      {label}
    </div>
    <div className="text-xl font-display font-bold">{value}</div>
  </div>
);

export default Claim;
