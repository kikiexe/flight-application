// sc/script/DeployFlightInsurance.s.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {FlightInsurance} from "../src/FlightInsurance.sol";

contract DeployFlightInsurance is Script {
    function run() external returns (FlightInsurance) {
        // Alamat token IDRX Anda yang sudah ada
        address existingIdrxTokenAddress = 0xEFeA2880F52F845cB6A5a7bAfbBe74ec67b38606;

        vm.startBroadcast();

        console.log("Menggunakan alamat IDRX yang sudah ada:", existingIdrxTokenAddress);

        // Deploy FlightInsurance dengan alamat IDRX dan alamat dompet Anda sebagai owner
        FlightInsurance flightInsurance = new FlightInsurance(existingIdrxTokenAddress, msg.sender);
        console.log("FlightInsurance contract deployed at:", address(flightInsurance));

        vm.stopBroadcast();
        return (flightInsurance);
    }
}