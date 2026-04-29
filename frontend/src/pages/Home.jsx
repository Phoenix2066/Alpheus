import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ShieldCheck, Zap } from 'lucide-react';

const Home = ({ account }) => {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-64px)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -mr-64 -mt-32 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-display font-bold leading-tight mb-8">
            Control the flow of your <span className="text-accent">tokens.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Alpheus lets you deploy ERC-20 tokens with vesting schedules in minutes — no code needed. Secure your team's future on the Sepolia testnet.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={account ? "/deploy" : "#"}
              className="w-full sm:w-auto px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:-translate-y-1"
            >
              {account ? "Launch Wizard" : "Connect Wallet to Start"}
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:border-accent transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <FeatureCard 
            icon={<Rocket className="w-8 h-8 text-accent" />}
            title="Instant Deployment"
            description="Create custom ERC-20 tokens in seconds with our intuitive wizard interface."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-accent" />}
            title="Built-in Vesting"
            description="Configure cliff and vesting periods directly at deployment for maximum security."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-accent" />}
            title="Claim Portal"
            description="A dedicated space for beneficiaries to track and claim their unlocked tokens."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-6">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400">{description}</p>
  </div>
);

export default Home;
