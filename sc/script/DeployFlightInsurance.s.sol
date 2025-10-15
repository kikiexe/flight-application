// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {FlightInsurance} from "../src/FlightInsurance.sol";
import {IDRS} from "../src/IDRS.sol";

contract DeployFlightInsurance is Script {
    function run() external returns (address flightInsuranceAddress, address idrsTokenAddress) {
        vm.startBroadcast();

        IDRS idrsToken = new IDRS();
        console.log("IDRS Token BARU di-deploy di:", address(idrsToken));

        FlightInsurance flightInsurance = new FlightInsurance(address(idrsToken), msg.sender);
        console.log("FlightInsurance contract di-deploy di:", address(flightInsurance));

        vm.stopBroadcast();
        
        return (address(flightInsurance), address(idrsToken));
    }
}