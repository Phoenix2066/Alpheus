import { ethers } from 'ethers';

export const FACTORY_ADDRESS = '0x34c8D41C9B14515c7ed44a3938691bf6d6643DFA';

export const FACTORY_ABI = [
  "event TokenDeployed(address indexed tokenAddress, address indexed deployer, string name, string symbol)",
  "function deployToken(string name, string symbol, uint256 totalSupply, address[] beneficiaries, uint256[] amounts, uint256 cliffDuration, uint256 vestingDuration) external returns (address)",
  "function getDeployedTokens() external view returns (address[])",
  "function getTokensByDeployer(address deployer) external view returns (address[])"
];

export const VESTED_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function claimable(address beneficiary) view returns (uint256)",
  "function vestedAmount(address beneficiary) view returns (uint256)",
  "function vestingSchedules(address beneficiary) view returns (uint256 totalAmount, uint256 startTime, uint256 cliffDuration, uint256 vestingDuration, uint256 claimed)",
  "function claim() external",
  "function decimals() view returns (uint8)"
];

export const getFactoryContract = (signerOrProvider) => {
  return new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signerOrProvider);
};

export const getTokenContract = (address, signerOrProvider) => {
  return new ethers.Contract(address, VESTED_TOKEN_ABI, signerOrProvider);
};
