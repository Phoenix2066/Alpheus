const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// POST /api/tokens - save a newly deployed token's metadata
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/tokens body:', req.body);
    const newToken = new Token(req.body);
    await newToken.save();
    console.log('Token saved to MongoDB');
    res.status(201).json({ success: true, message: 'Saved to database' });
  } catch (err) {
    // LOG THE ERROR BUT DON'T SEND 400
    console.error('Database Save Failed:', err.message);
    res.status(201).json({ 
      success: false, 
      message: 'Token deployed, but failed to save to dashboard database. You can still use the Claim portal with the address.',
      error: err.message 
    });
  }
});

// GET /api/tokens - get all tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find().sort({ deployedAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tokens/deployer/:wallet - get tokens by deployer wallet
router.get('/deployer/:wallet', async (req, res) => {
  try {
    const tokens = await Token.find({ deployerWallet: req.params.wallet.toLowerCase() }).sort({ deployedAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tokens/:address - get one token by address
router.get('/:address', async (req, res) => {
  try {
    const token = await Token.findOne({ tokenAddress: req.params.address.toLowerCase() });
    if (!token) return res.status(404).json({ message: 'Token not found' });
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
