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

---

### 📝 Detailed Smart Contract Deployment Guide

Follow these steps to get the Token Factory live on the Sepolia Testnet.

#### Step 1: Set Up Your Wallet
1.  **Install MetaMask:** Download the [MetaMask extension](https://metamask.io/) for your browser.
2.  **Create an Account:** Follow the prompts to create a new wallet. **Crucial:** Save your Secret Recovery Phrase in a safe, offline place.
3.  **Switch to Sepolia:** 
    *   Open MetaMask.
    *   Click the network selector (top left).
    *   Toggle "Show test networks" and select **Sepolia**.

#### Step 2: Get Sepolia ETH (Gas Money)
You need test ETH to pay for the deployment. Get it for free here:
*   [Google Cloud Faucet](https://cloud.google.com/application/redesign/faucets/ethereum/sepolia)
*   [Alchemy Faucet](https://sepoliafaucet.com/)
*   [Infura Faucet](https://www.infura.io/faucet/sepolia)

#### Step 3: Get an RPC URL
1.  Go to [Infura](https://infura.io/) or [Alchemy](https://alchemy.com/) and create a free account.
2.  Create a "New Project" or "App."
3.  Select **Sepolia** as the network.
4.  Copy your **HTTPS RPC URL**.

#### Step 4: Configure the Environment
1.  Navigate to the `contracts/` directory.
2.  Create a file named `.env` (or copy `.env.example`).
3.  Add your credentials:
    ```env
    SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
    PRIVATE_KEY=your_metamask_private_key
    ```
    *   *To find your Private Key:* Open MetaMask -> Account Details -> Export Private Key. **Never share this with anyone!**

#### Step 5: Deploy to Sepolia
Run the following commands in your terminal:
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
4.  **Copy the Address:** After the script finishes, it will print: `TokenFactory deployed to: 0x...`. Copy this address.

#### Step 6: Connect the Frontend
1.  Open `frontend/src/utils/contracts.js`.
2.  Replace the `FACTORY_ADDRESS` value with the address you just copied:
    ```javascript
    export const FACTORY_ADDRESS = '0xYourDeployedAddressHere';
    ```

---

### 🖥️ Running the Application

#### 1. Backend
```bash
cd backend
npm install
node server.js
```
*(Ensure MongoDB is running locally on port 27017)*

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

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
