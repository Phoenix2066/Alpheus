import React from 'react';
import { Link } from 'react-router-dom';
import { Waves } from 'lucide-react';
import WalletConnect from './WalletConnect';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ setAccount }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-accent rounded-lg group-hover:scale-110 transition-transform">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">Alpheus</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/deploy" className="text-sm font-medium hover:text-accent transition-colors">Deploy</Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-accent transition-colors">Dashboard</Link>
          <Link to="/claim" className="text-sm font-medium hover:text-accent transition-colors">Claim</Link>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletConnect setAccount={setAccount} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
