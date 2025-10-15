// sc/test/FlightInsurance.t.sol (FINAL - SUDAH DIPERBAIKI)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {FlightInsurance} from "../src/FlightInsurance.sol";
import {IDRS} from "../src/IDRS.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract FlightInsuranceTest is Test {
    FlightInsurance public flightInsurance;
    IDRS public idrs;

    address public owner = address(0x1);
    address public user = address(0x2);
    address public anotherUser = address(0x3);

    uint256 constant TICKET_PRICE = 1_000_000 * 10 ** 18;

    function setUp() public {
        vm.startPrank(owner);
        idrs = new IDRS();
        bool success = idrs.transfer(user, 10_000_000 * 10 ** 18);
        require(success, "Initial token transfer to user failed");
        vm.stopPrank();

        flightInsurance = new FlightInsurance(address(idrs), owner);
    }
    
    function test_MintTicketSuccessfully() public {
        vm.startPrank(user);
        idrs.approve(address(flightInsurance), TICKET_PRICE);
        uint256 departureDate = block.timestamp + 2 days;
        uint256 tokenId = flightInsurance.mintTicket("John Doe", 123, "Jakarta", "Bali", departureDate, TICKET_PRICE);
        vm.stopPrank();
        assertEq(tokenId, 1);
        assertEq(flightInsurance.ownerOf(tokenId), user);
    }

    function test_UserCanCancelTicket() public {
        uint256 userBalanceBefore = idrs.balanceOf(user);
        vm.startPrank(user);
        idrs.approve(address(flightInsurance), TICKET_PRICE);
        uint256 departureDate = block.timestamp + 2 days;
        uint256 tokenId = flightInsurance.mintTicket("Jane Doe", 456, "Surabaya", "Lombok", departureDate, TICKET_PRICE);
        
        flightInsurance.cancelTicket(tokenId);
        vm.stopPrank();

        uint256 expectedRefund = (TICKET_PRICE * 80) / 100;
        assertEq(idrs.balanceOf(user), userBalanceBefore - TICKET_PRICE + expectedRefund, "User should receive 80% refund");
        
        vm.expectRevert(abi.encodeWithSignature("ERC721NonexistentToken(uint256)", tokenId));
        flightInsurance.ownerOf(tokenId);
    }
    
    function test_Refunds5PercentFor1HourDelay() public { 
        test_MintTicketSuccessfully();
        vm.startPrank(owner);
        flightInsurance.reportFlightStatus(1, FlightInsurance.Status.Delay, 1);
        vm.stopPrank();
        uint256 expectedRefund = (TICKET_PRICE * 5) / 100;
        assertEq(idrs.balanceOf(user), (10_000_000 * 10 ** 18) - TICKET_PRICE + expectedRefund);
        FlightInsurance.TicketInfo memory info = flightInsurance.getTicketInfo(1);
        assertEq(uint(info.status), uint(FlightInsurance.Status.Refunded));
        assertEq(info.refundAmount, expectedRefund);
    }

    function test_Refunds95PercentForCancellation() public { 
        test_MintTicketSuccessfully();
        uint256 userBalanceBeforeRefund = idrs.balanceOf(user);
        vm.startPrank(owner);
        flightInsurance.reportFlightStatus(1, FlightInsurance.Status.Cancelled, 0);
        vm.stopPrank();
        uint256 expectedRefund = (TICKET_PRICE * 95) / 100;
        assertEq(idrs.balanceOf(user), userBalanceBeforeRefund + expectedRefund);
        FlightInsurance.TicketInfo memory info = flightInsurance.getTicketInfo(1);
        assertEq(uint(info.status), uint(FlightInsurance.Status.Refunded));
    }
    
    function test_OwnerCanWithdrawFunds() public { 
        test_Refunds95PercentForCancellation();
        uint256 ownerBalanceBefore = idrs.balanceOf(owner);
        uint256 contractBalance = idrs.balanceOf(address(flightInsurance));
        assertEq(contractBalance, TICKET_PRICE - (TICKET_PRICE * 95) / 100);
        vm.startPrank(owner);
        flightInsurance.withdrawFunds();
        vm.stopPrank();
        assertEq(idrs.balanceOf(address(flightInsurance)), 0);
        assertEq(idrs.balanceOf(owner), ownerBalanceBefore + contractBalance);
    }
    
    function test_Fail_NonOwnerCannotWithdrawFunds() public { 
        test_MintTicketSuccessfully();
        vm.startPrank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        flightInsurance.withdrawFunds();
        vm.stopPrank();
    }

    function test_Fail_CannotCancelWithin24Hours() public {
        vm.startPrank(user);
        idrs.approve(address(flightInsurance), TICKET_PRICE);
        uint256 departureDate = block.timestamp + 36 hours;
        uint256 tokenId = flightInsurance.mintTicket("Jane Doe", 456, "Surabaya", "Lombok", departureDate, TICKET_PRICE);
        vm.stopPrank();
        vm.warp(departureDate - 12 hours);
        vm.startPrank(user);
        vm.expectRevert("Cannot cancel within 24h of flight");
        flightInsurance.cancelTicket(tokenId);
        vm.stopPrank();
    }
    
    function test_Fail_NonOwnerCannotCancelTicket() public {
        vm.startPrank(user);
        idrs.approve(address(flightInsurance), TICKET_PRICE);
        uint256 tokenId = flightInsurance.mintTicket("John Doe", 123, "Jakarta", "Bali", block.timestamp + 2 days, TICKET_PRICE);
        vm.stopPrank();
        vm.startPrank(anotherUser);
        vm.expectRevert("Caller is not the ticket owner");
        flightInsurance.cancelTicket(tokenId);
        vm.stopPrank();
    }
    
    function test_OwnerCanPauseAndUnpause() public {
        assertEq(flightInsurance.paused(), false);
        vm.startPrank(owner);
        flightInsurance.pause();
        vm.stopPrank();
        assertEq(flightInsurance.paused(), true);
        vm.startPrank(owner);
        flightInsurance.unpause();
        vm.stopPrank();
        assertEq(flightInsurance.paused(), false);
    }
    
    function test_Fail_CannotMintWhenPaused() public {
        vm.startPrank(owner);
        flightInsurance.pause();
        vm.stopPrank();
        vm.startPrank(user);
        idrs.approve(address(flightInsurance), TICKET_PRICE);
        // --- PERBAIKAN FINAL ---
        vm.expectRevert(abi.encodeWithSignature("EnforcedPause()"));
        flightInsurance.mintTicket("Paused User", 789, "A", "B", block.timestamp + 2 days, TICKET_PRICE);
        vm.stopPrank();
    }
    
    function test_Fail_NonOwnerCannotPause() public {
        vm.startPrank(user);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, user));
        flightInsurance.pause();
        vm.stopPrank();
    }
}