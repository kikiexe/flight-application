const { ethers } = require('ethers');
require('dotenv').config();

async function test() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.BACKEND_PRIVATE_KEY, provider);
    
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    // Minimal ABI untuk test
    const minimalABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function owner() view returns (address)"
    ];
    
    const contract = new ethers.Contract(contractAddress, minimalABI, signer);
    
    try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        const owner = await contract.owner();
        
        console.log("Contract Name:", name);
        console.log("Contract Symbol:", symbol);
        console.log("Contract Owner:", owner);
        console.log("✅ Contract is working!");
    } catch (error) {
        console.error("❌ Contract test failed:", error.message);
    }
}

test();