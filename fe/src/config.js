// src/config.js
import { parseAbi } from 'viem';

// Ganti dengan alamat kontrak hasil deployment Anda
export const contractAddress = 'ALAMAT_KONTRAK_FLIGHTINSURANCE_ANDA';
export const mockIdrxAddress = 'ALAMAT_KONTRAK_MOCKIDRX_ANDA';

// ABI dari FlightInsurance.sol
export const contractABI = [
    "function mintTicket(string passengerName, uint256 flightId, string departureCity, string destinationCity, uint256 departureDate, uint256 amount) returns (uint256)",
    "function ticketDetails(uint256) view returns (uint256 flightId, string passengerName, string departureCity, string destinationCity, uint256 departureDate, uint256 amount, uint8 status, uint256 refundAmount)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function reportFlightStatus(uint256 tokenId, uint8 status, uint256 delayInHours)",
    "function withdrawFunds()",
    "function balanceOf(address owner) view returns (uint256)"
];

// ABI minimal untuk fungsi approve di token ERC20
export const idrxABI = parseAbi(['function approve(address spender, uint256 amount) external returns (bool)']);