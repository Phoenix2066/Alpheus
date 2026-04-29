const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenAddress: { type: String, required: true, unique: true },
  deployerWallet: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  totalSupply: { type: String, required: true },
  beneficiaryCount: { type: Number },
  cliffDuration: { type: Number },
  vestingDuration: { type: Number },
  deployedAt: { type: Date, default: Date.now },
  txHash: { type: String }
});

module.exports = mongoose.model('Token', TokenSchema);
