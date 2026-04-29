import React, { useState, useEffect } from 'react';
import { getSigner, formatAddress, isSepolia, switchNetwork } from '../utils/ethers';
import { AlertCircle } from 'lucide-react';

const WalletConnect = ({ setAccount }) => {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const checkNetwork = async () => {
    if (window.ethereum) {
      const onSepolia = await isSepolia();
      setWrongNetwork(!onSepolia);
    }
  };

  const connectWallet = async () => {
    try {
      setError('');
      if (!window.ethereum) {
        setError('MetaMask not detected');
        return;
      }
      
      const signer = await getSigner();
      if (signer) {
        const addr = await signer.getAddress();
        setAddress(addr);
        setAccount(addr);
        await checkNetwork();
      }
    } catch (err) {
      setError('Connection failed');
      console.error(err);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    setAccount('');
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setAccount(accounts[0]);
        } else {
          setAddress('');
          setAccount('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, [setAccount]);

  return (
    <div className="flex flex-col items-end">
      {address ? (
        <div className="flex items-center gap-4">
          {wrongNetwork && (
            <button
              onClick={switchNetwork}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
            >
              <AlertCircle className="w-4 h-4" />
              Switch to Sepolia
            </button>
          )}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
              {formatAddress(address)}
            </span>
            <button
              onClick={disconnectWallet}
              className="text-sm text-slate-500 hover:text-red-500 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
        >
          Connect Wallet
        </button>
      )}
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default WalletConnect;
