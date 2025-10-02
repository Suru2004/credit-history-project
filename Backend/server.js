// File: backend/server.js --- FOR ETHERS V6
const express = require('express');
const ethers = require('ethers');
const cors = require('cors');
require('dotenv').config();

const { abi } = require('./CreditHistory.json');

const app = express();
app.use(express.json());
app.use(cors());

// --- Ethereum Connection Setup ---
const CONTRACT_ADDRESS = "0xYourNewLocalhostContractAddress"; // ❗️ PASTE YOUR NEW LOCALHOST CONTRACT ADDRESS HERE
const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

const provider = new ethers.StaticJsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const creditHistoryContract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// --- API Endpoints ---
app.post('/api/generate-id', (req, res) => {
    const { panNumber } = req.body;
    if (!panNumber) return res.status(400).json({ error: "PAN number is required" });
    const userId = ethers.keccak256(ethers.toUtf8Bytes(panNumber));
    res.json({ userId });
});

app.post('/api/add-loan', async (req, res) => {
    const { userId, loanAmount, loanType, status } = req.body;
    try {
        const tx = await creditHistoryContract.addLoan(userId, loanAmount, loanType, status);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/get-loans/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const loans = await creditHistoryContract.getLoans(userId);
        const formattedLoans = loans.map(loan => ({ issuingBank: loan.issuingBank, loanAmount: loan.loanAmount.toString(), loanType: loan.loanType, dateIssued: new Date(Number(loan.dateIssued) * 1000).toLocaleString(), status: loan.status }));
        res.json(formattedLoans);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Backend server running on http://localhost:${PORT}`));