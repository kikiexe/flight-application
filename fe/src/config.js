// fe/src/config.js (SUDAH DIPERBARUI & LENGKAP)

import { parseAbi } from 'viem';

// --- ALAMAT KONTRAK BARU ANDA DARI DEPLOYMENT TERAKHIR ---
export const contractAddress = '0x9Ef5459216E8Bf1f12618cb3FA795C71a4cC6BCE';
export const idrsTokenAddress = '0xAE5CD607f92bED8482422c10B7e85245eFc7f79E';

// --- ABI LENGKAP DARI FlightInsurance.sol ---
export const contractABI = [
  "constructor(address _idrsToken, address initialOwner)",
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
  "function idrsToken() view returns (address)",
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

// --- ABI MINIMAL UNTUK FUNGSI APPROVE DI TOKEN IDRS ---
export const idrsABI = parseAbi(['function approve(address spender, uint256 amount) external returns (bool)']);