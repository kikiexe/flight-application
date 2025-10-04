// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {FlightInsurance} from "../src/FlightInsurance.sol";
import {MockIDRX} from "../test/FlightInsurance.t.sol";

contract DeployFlightInsurance is Script {

    function run() external returns (FlightInsurance, MockIDRX) {
        // Alamat yang akan menjadi owner/backend dari contract (yang menjalankan script)
        address owner = msg.sender;

        // Alamat wallet user simulasi (Akun #1 dari Anvil)
        address userWallet = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

        vm.startBroadcast();

        // 1. Deploy MockIDRX
        console.log("Deploying MockIDRX...");
        MockIDRX idrx = new MockIDRX();
        console.log("MockIDRX deployed to:", address(idrx));

        // 2. Beri "uang saku" 10 Juta IDRX ke wallet user
        uint256 initialUserBalance = 10000000 * 1e2; // Rp 10.000.000
        idrx.mint(userWallet, initialUserBalance);
        console.log("Minted", initialUserBalance, "IDRX to user wallet:", userWallet);
        
        // 3. Deploy FlightInsurance dengan alamat MockIDRX dan owner
        console.log("Deploying FlightInsurance...");
        FlightInsurance flightInsurance = new FlightInsurance(address(idrx), owner);
        console.log("FlightInsurance deployed to:", address(flightInsurance));

        vm.stopBroadcast();
        
        return (flightInsurance, idrx);
    }
}