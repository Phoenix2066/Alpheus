import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, ExternalLink, ArrowRight } from 'lucide-react';
import { formatAddress } from '../utils/ethers';

const Dashboard = ({ account }) => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = activeTab === 'mine' && account
        ? `http://localhost:5000/api/tokens/deployer/${account}`
        : 'http://localhost:5000/api/tokens';
      const res = await axios.get(url);
      setTokens(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tokens. Is the backend running and connected to MongoDB?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [activeTab, account]);

  const filteredTokens = tokens.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.tokenAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-slate-500">Discover and manage vested tokens on Alpheus.</p>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, symbol, or address..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-accent transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-8 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-xl">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent' : 'text-slate-500'}`}
        >
          All Tokens
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          disabled={!account}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${!account ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'mine' ? 'bg-white dark:bg-slate-700 shadow-sm text-accent' : 'text-slate-500'}`}
        >
          My Tokens
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-3xl border-2 border-dashed border-red-200 dark:border-red-800">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : filteredTokens.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTokens.map(token => (
            <TokenCard key={token.tokenAddress} token={token} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-medium">No tokens found.</p>
          {activeTab === 'mine' && !account && <p className="text-sm text-slate-400 mt-2">Please connect your wallet to see your tokens.</p>}
        </div>
      )}
    </div>
  );
};

const TokenCard = ({ token }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 hover:shadow-xl transition-all group">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-2xl font-display font-bold group-hover:text-accent transition-colors">{token.name}</h3>
        <span className="text-sm font-mono text-slate-400 uppercase">{token.symbol}</span>
      </div>
      <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full">
        {parseFloat(token.totalSupply).toLocaleString()} Total
      </div>
    </div>

    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Users className="w-4 h-4" />
        <span>{token.beneficiaryCount} Beneficiaries</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <Calendar className="w-4 h-4" />
        <span>Deployed {new Date(token.deployedAt).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <ExternalLink className="w-4 h-4" />
        <span className="font-mono">{formatAddress(token.tokenAddress)}</span>
      </div>
    </div>

    <Link
      to={`/claim?address=${token.tokenAddress}`}
      className="flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all font-bold"
    >
      Claim Portal <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
);

export default Dashboard;
