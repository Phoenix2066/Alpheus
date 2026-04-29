import { ethers } from 'ethers';

export const getProvider = () => {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

export const isSepolia = async () => {
  if (!window.ethereum) return false;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return chainId === SEPOLIA_CHAIN_ID;
};

export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Test Network',
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          },
        ],
      });
    }
  }
};
