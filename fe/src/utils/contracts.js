// fe/src/utils/contracts.js

export const FLIGHT_INSURANCE_ADDRESS = '0x9Ef5459216E8Bf1f12618cb3FA795C71a4cC6BCE';
export const IDRS_TOKEN_ADDRESS = '0xAE5CD607f92bED8482422c10B7e85245eFc7f79E';

export const FLIGHT_INSURANCE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_idrsToken", "type": "address" },
      { "internalType": "address", "name": "initialOwner", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "enum FlightInsurance.Status", "name": "originalStatus", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
    ],
    "name": "FlightStatusReported",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
    ],
    "name": "RefundProcessed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "passengerName", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "flightId", "type": "uint256" }
    ],
    "name": "TicketMinted",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getTicketInfo",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "flightId", "type": "uint256" },
          { "internalType": "string", "name": "passengerName", "type": "string" },
          { "internalType": "string", "name": "departureCity", "type": "string" },
          { "internalType": "string", "name": "destinationCity", "type": "string" },
          { "internalType": "uint256", "name": "departureDate", "type": "uint256" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "enum FlightInsurance.Status", "name": "status", "type": "uint8" },
          { "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
        ],
        "internalType": "struct FlightInsurance.TicketInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "idrsToken",
    "outputs": [
      { "internalType": "contract IERC20", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "passengerName", "type": "string" },
      { "internalType": "uint256", "name": "flightId", "type": "uint256" },
      { "internalType": "string", "name": "departureCity", "type": "string" },
      { "internalType": "string", "name": "destinationCity", "type": "string" },
      { "internalType": "uint256", "name": "departureDate", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "mintTicket",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "enum FlightInsurance.Status", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "delayInHours", "type": "uint256" }
    ],
    "name": "reportFlightStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "ticketDetails",
    "outputs": [
      { "internalType": "uint256", "name": "flightId", "type": "uint256" },
      { "internalType": "string", "name": "passengerName", "type": "string" },
      { "internalType": "string", "name": "departureCity", "type": "string" },
      { "internalType": "string", "name": "destinationCity", "type": "string" },
      { "internalType": "uint256", "name": "departureDate", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "enum FlightInsurance.Status", "name": "status", "type": "uint8" },
      { "internalType": "uint256", "name": "refundAmount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "tokenURI",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFunds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];


// ABI minimal untuk fungsi `approve` pada token ERC20
export const ERC20_ABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [
      { "name": "", "type": "bool" }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
        { "name": "owner", "type": "address" },
        { "name": "spender", "type": "address" }
    ],
    "name": "allowance",
    "outputs": [
        { "name": "", "type": "uint256" }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];