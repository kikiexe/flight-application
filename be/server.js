// be/server.js (SUDAH DIPERBARUI)

const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- KONFIGURASI KONTRAK ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const backendWallet = new ethers.Wallet(process.env.BACKEND_PRIVATE_KEY, provider);

// --- PERBAIKAN: ABI Lengkap dari Smart Contract Terbaru ---
const contractABI = [
  "constructor(address _idrxToken, address initialOwner)",
  "error ERC721IncorrectOwner(address sender, uint256 tokenId, address owner)",
  "error ERC721InsufficientApproval(address operator, uint256 tokenId)",
  "error ERC721InvalidApprover(address approver)",
  "error ERC721InvalidOperator(address operator)",
  "error ERC721InvalidOwner(address owner)",
  "error ERC721InvalidReceiver(address receiver)",
  "error ERC721InvalidSender(address sender)",
  "error ERC721NonexistentToken(uint256 tokenId)",
  "error EnforcedPause()",
  "error ExpectedPause()",
  "error OwnableInvalidOwner(address owner)",
  "error OwnableUnauthorizedAccount(address account)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId)",
  "event FlightStatusReported(uint256 indexed tokenId, uint8 newStatus, uint256 refundAmount)",
  "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
  "event Paused(address account)",
  "event RefundProcessed(uint256 indexed tokenId, address indexed owner, uint256 refundAmount)",
  "event TicketCancelledByUser(uint256 indexed tokenId, address indexed owner)",
  "event TicketMinted(uint256 indexed tokenId, address indexed owner, string passengerName, uint256 flightId)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Unpaused(address account)",
  "function approve(address to, uint256 tokenId)",
  "function balanceOf(address owner) view returns (uint256)",
  "function cancelTicket(uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function getTicketInfo(uint256 tokenId) view returns (tuple(uint256 flightId, string passengerName, string departureCity, string destinationCity, uint256 departureDate, uint256 amount, uint8 status, uint256 refundAmount))",
  "function idrxToken() view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  "function mintTicket(string passengerName, uint256 flightId, string departureCity, string destinationCity, uint256 departureDate, uint256 amount) returns (uint256)",
  "function name() view returns (string)",
  "function owner() view returns (address)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function pause()",
  "function paused() view returns (bool)",
  "function renounceOwnership()",
  "function reportFlightStatus(uint256 tokenId, uint8 status, uint256 delayInHours)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
  "function setApprovalForAll(address operator, bool _approved)",
  "function supportsInterface(bytes4 interfaceId) view returns (bool)",
  "function symbol() view returns (string)",
  "function ticketDetails(uint256) view returns (uint256 flightId, string passengerName, string departureCity, string destinationCity, uint256 departureDate, uint256 amount, uint8 status, uint256 refundAmount)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function transferOwnership(address newOwner)",
  "function unpause()",
  "function withdrawFunds()"
];


const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, backendWallet);

console.log("Backend terhubung ke kontrak di alamat:", process.env.CONTRACT_ADDRESS);


// --- API ENDPOINTS ---

// Endpoint untuk data dummy penerbangan
const dummyFlights = [
  { id: 1, airline: 'Satha Fly', flightNumber: 'SF 204', departureTime: '07:30', arrivalTime: '10:15', duration: '2j 45m', price: 1500000 },
  { id: 2, airline: 'Satha Fly', flightNumber: 'SF 032', departureTime: '08:00', arrivalTime: '10:50', duration: '2j 50m', price: 1400000 },
  { id: 3, airline: 'Satha Fly', flightNumber: 'SF 812', departureTime: '09:15', arrivalTime: '12:00', duration: '2j 45m', price: 1100000 },
];

app.post('/api/flights/search', (req, res) => {
  const searchParams = req.body;
  console.log('[POST /api/flights/search] Menerima permintaan pencarian:', searchParams);
  // Logika filter bisa ditambahkan di sini jika perlu
  res.json(dummyFlights);
});

// Endpoint untuk melaporkan status penerbangan (oleh backend/owner)
app.post('/report-status', async (req, res) => {
    const { tokenId, status, delayInHours } = req.body;

    // Konversi status string ke enum integer
    const statusEnum = { "Delay": 1, "Cancelled": 2 };
    const statusInt = statusEnum[status];

    if (typeof statusInt === 'undefined') {
        return res.status(400).json({ error: "Status tidak valid. Gunakan 'Delay' atau 'Cancelled'." });
    }

    try {
        console.log(`[POST /report-status] Melaporkan status untuk Token ID #${tokenId}: ${status}, Delay: ${delayInHours || 0} jam`);
        const tx = await contract.reportFlightStatus(tokenId, statusInt, delayInHours || 0);
        await tx.wait();
        console.log(`[POST /report-status] Laporan untuk Token ID #${tokenId} berhasil diproses.`);
        res.status(200).json({ message: "Status penerbangan berhasil dilaporkan.", transactionHash: tx.hash });
    } catch (error) {
        console.error(`[POST /report-status] Error:`, error);
        res.status(500).json({ error: "Gagal melaporkan status penerbangan." });
    }
});


// Endpoint untuk mengambil detail tiket (public)
app.get('/tickets/:tokenId', async (req, res) => {
    const { tokenId } = req.params;
    try {
        const ticket = await contract.getTicketInfo(tokenId);
        // `ticket` adalah sebuah array/tuple, kita perlu mengubahnya menjadi objek
        const statusString = ["Purchased", "Delay", "Cancelled", "Refunded"][Number(ticket.status)];

        res.status(200).json({
            tokenId: tokenId,
            passengerName: ticket.passengerName,
            flightId: Number(ticket.flightId),
            route: `${ticket.departureCity} - ${ticket.destinationCity}`,
            departureDate: new Date(Number(ticket.departureDate) * 1000).toISOString(),
            price: ethers.formatEther(ticket.amount),
            status: statusString,
            refundAmount: ethers.formatEther(ticket.refundAmount),
        });
    } catch (error) {
        console.error(`[GET /tickets] Error:`, error);
        res.status(500).json({ error: "Tidak dapat mengambil data tiket." });
    }
});

// Endpoint untuk menarik dana (oleh backend/owner)
app.post('/withdraw', async (req, res) => {
    try {
        console.log(`[POST /withdraw] Backend meminta penarikan dana...`);
        const tx = await contract.withdrawFunds();
        await tx.wait();
        console.log(`[POST /withdraw] Penarikan dana berhasil.`);
        res.status(200).json({ message: "Dana berhasil ditarik.", transactionHash: tx.hash });
    } catch (error) { 
        console.error("[POST /withdraw] Error:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat menarik dana." });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server berjalan di http://localhost:${PORT}`);
});