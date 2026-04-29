# Alpheus — ERC-20 + Vesting Deploy Wizard

Alpheus is a full-stack Web3 application that allows users to deploy custom ERC-20 tokens with built-in vesting schedules on the Sepolia testnet. It provides a "No-Code" interface for founders to secure their project's future and a dedicated portal for beneficiaries to claim their unlocked tokens.

## 🚀 Features

- **Token Factory:** Deploy professional ERC-20 tokens without writing a single line of Solidity.
- **Vesting Vault:** Configure cliff durations and linear vesting periods directly at deployment.
- **Global Dashboard:** A MongoDB-backed registry of all tokens deployed via the platform.
- **Claim Portal:** A trustless interface for beneficiaries to track and withdraw unlocked tokens.
- **Theme Support:** Modern UI with Light and Dark mode.

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity ^0.8.20, Hardhat, OpenZeppelin.
- **Frontend:** React 18, Vite, Tailwind CSS v3, ethers.js v6, Lucide Icons.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Network:** Sepolia Testnet.

## 📂 Project Structure

- `contracts/`: Hardhat project containing the Solidity smart contracts and deployment scripts.
- `backend/`: Express API for storing and retrieving token metadata.
- `frontend/`: React application built with Vite and Tailwind.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally (default: `mongodb://localhost:27017/alpheus`)
- MetaMask wallet with Sepolia ETH

### 1. Smart Contracts
```bash
cd contracts
npm install
# Configure .env with SEPOLIA_RPC_URL and PRIVATE_KEY
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 2. Backend
```bash
cd backend
npm install
# Ensure .env is configured with MONGO_URI
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
# Update FACTORY_ADDRESS in src/utils/contracts.js
npm run dev
```

## 📖 How to Use

1. **Connect Wallet:** Link your MetaMask to the app on the Sepolia network.
2. **Deploy:** Fill out the Wizard with token details, a cliff duration, and beneficiary addresses.
3. **Confirm:** Approve the transaction in MetaMask.
4. **Distribute:** Share the token address with your team.
5. **Claim:** Beneficiaries can visit the **Claim** page, paste the token address, and withdraw unlocked tokens after the cliff expires.

## 🛡️ Security
- **Factory Ownership:** The factory transfers ownership of the deployed token to the user immediately after setup.
- **Linear Vesting:** Tokens are calculated on-chain, ensuring trustless distribution.
- **Database Safety:** MongoDB only stores metadata; all financial logic lives on the blockchain.

---
Built with 🌊 Alpheus River God theme.
