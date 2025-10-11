const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dummyFlights = [
  { id: 1, airline: 'Satha Fly', flightNumber: 'SF 204', departureTime: '07:30', arrivalTime: '10:15', duration: '2j 45m', price: 1500000 },
  { id: 2, airline: 'Satha Fly', flightNumber: 'SF 032', departureTime: '08:00', arrivalTime: '10:50', duration: '2j 50m', price: 1400000 },
  { id: 3, airline: 'Satha Fly', flightNumber: 'SF 812', departureTime: '09:15', arrivalTime: '12:00', duration: '2j 45m', price: 1100000 },
];

app.post('/api/flights/search', (req, res) => {
  const searchParams = req.body;
  console.log('[POST /api/flights/search] Backend menerima permintaan pencarian untuk:', searchParams);
  
  // Untuk sekarang, kita kembalikan semua data dummy.
  // Nantinya Anda bisa menambahkan logika filter di sini.
  res.status(200).json(dummyFlights);
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const backendSigner = new ethers.Wallet(process.env.BACKEND_PRIVATE_KEY, provider);
const userSigner = new ethers.Wallet(process.env.USER_PRIVATE_KEY, provider);

const contractAddress = process.env.CONTRACT_ADDRESS;
const mockIdrxAddress = process.env.MOCKIDRX_ADDRESS;

// Simplified ABI - hanya yang kita butuhkan
const contractABI = [
    "function mintTicket(string passengerName, uint256 flightId, string departureCity, string destinationCity, uint256 departureDate, uint256 amount) returns (uint256)",
    "function ticketDetails(uint256) view returns (uint256 flightId, string passengerName, string departureCity, string destinationCity, uint256 departureDate, uint256 amount, uint8 status, uint256 refundAmount)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function reportFlightStatus(uint256 tokenId, uint8 status, uint256 delayInHours)",
    "function withdrawFunds()",
    "function balanceOf(address owner) view returns (uint256)"
];

const idrxABI = [
    "function approve(address spender, uint256 amount) returns (bool)"
];

const contractAsBackend = new ethers.Contract(contractAddress, contractABI, backendSigner);
const contractAsUser = new ethers.Contract(contractAddress, contractABI, userSigner);
const idrxContractAsUser = new ethers.Contract(mockIdrxAddress, idrxABI, userSigner);

console.log(`[BLOCKCHAIN] Terhubung dengan Smart Contract di alamat: ${contractAddress}`);

let lastTokenId = 0;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Selamat datang di Flight Insurance API!' });
});

app.post('/tickets', async (req, res) => {
    try {
        const { passengerName, flightId, departureCity, destinationCity, departureDate, amount } = req.body;
        if (!passengerName || !flightId || !amount) {
            return res.status(400).json({ error: "Input tidak lengkap." });
        }

        console.log(`[POST /tickets] User (${userSigner.address}) meminta mint tiket...`);

        const nonce = await provider.getTransactionCount(userSigner.address, 'latest');
        console.log(`[DEBUG] Nonce: ${nonce}`);

        console.log(`[POST /tickets] Approve IDRX...`);
        const approveTx = await idrxContractAsUser.approve(contractAddress, amount, { nonce });
        await approveTx.wait();
        console.log(`[POST /tickets] Approve berhasil.`);

        console.log(`[POST /tickets] Mint ticket...`);
        const mintTx = await contractAsUser.mintTicket(
            passengerName, 
            flightId, 
            departureCity || "", 
            destinationCity || "", 
            departureDate || 0, 
            amount,
            { nonce: nonce + 1 }
        );
        
        await mintTx.wait();
        console.log(`[POST /tickets] Mint berhasil, hash: ${mintTx.hash}`);

        lastTokenId++;
        const tokenId = lastTokenId;
        
        console.log(`[DEBUG] TokenId: ${tokenId}`);

        // Gunakan ticketDetails langsung instead of getTicketInfo
        const ticket = await contractAsBackend.ticketDetails(tokenId);
        const owner = await contractAsBackend.ownerOf(tokenId);
        
        const statusString = ["Purchased", "Delay", "Cancelled", "Refunded"][Number(ticket.status)];

        res.status(201).json({
            message: "Tiket berhasil di-mint!",
            transactionHash: mintTx.hash,
            ticket: {
                tokenId: tokenId,
                owner: owner,
                passengerName: ticket.passengerName,
                flightId: Number(ticket.flightId),
                route: `${ticket.departureCity} - ${ticket.destinationCity}`,
                departureDate: Number(ticket.departureDate),
                price: Number(ticket.amount),
                status: statusString
            }
        });

    } catch (error) {
        console.error("[POST /tickets] Error:", error);
        res.status(500).json({ 
            error: "Terjadi kesalahan saat memproses tiket.", 
            details: error.message 
        });
    }
});

app.post('/report-status', async (req, res) => {
    try {
        const { tokenId, status, delayInHours } = req.body;
        const statusEnum = { "Purchased": 0, "Delay": 1, "Cancelled": 2, "Refunded": 3 };
        const statusInt = statusEnum[status];
        
        console.log(`[POST /report-status] Backend melaporkan status untuk tokenId: ${tokenId}`);
        const tx = await contractAsBackend.reportFlightStatus(tokenId, statusInt, delayInHours || 0);
        
        await tx.wait();
        console.log(`[POST /report-status] Status berhasil dilaporkan.`);
        res.status(200).json({ message: "Status penerbangan berhasil dilaporkan.", transactionHash: tx.hash });
    } catch (error) {
        console.error("[POST /report-status] Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat melaporkan status." });
    }
});

app.get('/tickets/:tokenId', async (req, res) => {
    try {
        const { tokenId } = req.params;
        const ticket = await contractAsBackend.ticketDetails(tokenId);
        const owner = await contractAsBackend.ownerOf(tokenId);
        const statusString = ["Purchased", "Delay", "Cancelled", "Refunded"][Number(ticket.status)];

        res.status(200).json({
            tokenId: tokenId,
            owner: owner,
            passengerName: ticket.passengerName,
            flightId: Number(ticket.flightId),
            route: `${ticket.departureCity} - ${ticket.destinationCity}`,
            departureDate: Number(ticket.departureDate),
            price: Number(ticket.amount),
            status: statusString,
            refundAmount: Number(ticket.refundAmount),
        });
    } catch (error) {
        console.error(`[GET /tickets] Error:`, error);
        res.status(500).json({ error: "Tidak dapat mengambil data tiket." });
    }
});

app.post('/withdraw', async (req, res) => {
    try {
        console.log(`[POST /withdraw] Backend meminta penarikan dana...`);
        const tx = await contractAsBackend.withdrawFunds();
        await tx.wait();
        console.log(`[POST /withdraw] Penarikan dana berhasil.`);
        res.status(200).json({ message: "Dana berhasil ditarik.", transactionHash: tx.hash });
    } catch (error) { 
        console.error("[POST /withdraw] Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat menarik dana." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`✈️  Server Backend (gabungan) siap di http://localhost:${port}`);
    console.log("   Tekan CTRL+C untuk menghentikan server.");
});