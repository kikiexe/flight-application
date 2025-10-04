// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {FlightInsurance} from "../src/FlightInsurance.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockIDRX is IERC20 {
    string public name = "Mock IDRX";
    string public symbol = "MIDRX";
    uint8 public decimals = 2;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }
}

contract FlightInsuranceNFTTest is Test {
    FlightInsurance public flightInsurance;
    MockIDRX public idrx;

    address user = address(0x1);
    address backend = address(this);

    function setUp() public {
        idrx = new MockIDRX();
        flightInsurance = new FlightInsurance(address(idrx), backend);
        
        // Memberi user 10 Juta IDRX (Rp 10.000.000,00)
        idrx.mint(user, 10000000 * 1e2);
    }

    function test_MintTicketSuccessfully() public {
        string memory passengerName = "Budi";
        uint256 flightId = 777;
        string memory departureCity = "Jakarta";
        string memory destinationCity = "Bali";
        uint256 departureDate = 1727308800;
        uint256 ticketPrice = 1500000 * 1e2; // Harga tiket Rp 1.500.000,00

        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        uint256 newTokenId = flightInsurance.mintTicket(
            passengerName,
            flightId,
            departureCity,
            destinationCity,
            departureDate,
            ticketPrice
        );
        vm.stopPrank();

        assertEq(newTokenId, 1, "First token ID should be 1");
        assertEq(flightInsurance.ownerOf(newTokenId), user, "User should own the new NFT ticket");

        FlightInsurance.TicketInfo memory info = flightInsurance.getTicketInfo(newTokenId);
        assertEq(info.passengerName, passengerName, "Passenger name should match");
        
        assertEq(idrx.balanceOf(address(flightInsurance)), ticketPrice, "Contract should receive the IDRX");
    }

    function test_RefundForCancellationToNFTOwner() public {
        uint256 ticketPrice = 1500000 * 1e2; // Rp 1.500.000,00
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        flightInsurance.mintTicket("Budi", 777, "Jakarta", "Bali", block.timestamp, ticketPrice);
        vm.stopPrank();
        
        uint256 tokenId = 1;
        uint256 userBalanceBefore = idrx.balanceOf(user);

        vm.startPrank(backend);
        flightInsurance.reportFlightStatus(tokenId, FlightInsurance.Status.Cancelled, 0);
        vm.stopPrank();

        uint256 expectedRefund = (ticketPrice * 95) / 100;
        uint256 userBalanceAfter = idrx.balanceOf(user);
        assertEq(userBalanceAfter, userBalanceBefore + expectedRefund, "User should receive 95% refund");

        FlightInsurance.TicketInfo memory info = flightInsurance.getTicketInfo(tokenId);
        assertEq(uint(info.status), uint(FlightInsurance.Status.Refunded), "Ticket status should be Refunded");
    }

    function test_RefundForShortDelay_5_Percent() public {
        uint256 ticketPrice = 1000000 * 1e2; // Rp 1.000.000
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        flightInsurance.mintTicket("User Delay 1", 101, "CGK", "DPS", block.timestamp, ticketPrice);
        vm.stopPrank();

        uint256 tokenId = 1;
        uint256 userBalanceBefore = idrx.balanceOf(user);

        // ACT: Backend melaporkan delay 2 jam
        vm.startPrank(backend);
        flightInsurance.reportFlightStatus(tokenId, FlightInsurance.Status.Delay, 2);
        vm.stopPrank();

        // ASSERT: Verifikasi refund 5%
        uint256 expectedRefund = (ticketPrice * 5) / 100; // 50.000 IDRX
        uint256 userBalanceAfter = idrx.balanceOf(user);
        assertEq(userBalanceAfter, userBalanceBefore + expectedRefund, "User should receive 5% refund");
    }

    // Tes untuk delay medium (3-5 jam) -> 15% refund
    function test_RefundForMediumDelay_15_Percent() public {
        uint256 ticketPrice = 1000000 * 1e2; // Rp 1.000.000
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        flightInsurance.mintTicket("User Delay 2", 102, "CGK", "DPS", block.timestamp, ticketPrice);
        vm.stopPrank();

        uint256 tokenId = 1;
        uint256 userBalanceBefore = idrx.balanceOf(user);

        // ACT: Backend melaporkan delay 4 jam
        vm.startPrank(backend);
        flightInsurance.reportFlightStatus(tokenId, FlightInsurance.Status.Delay, 4);
        vm.stopPrank();

        // ASSERT: Verifikasi refund 15%
        uint256 expectedRefund = (ticketPrice * 15) / 100; // 150.000 IDRX
        uint256 userBalanceAfter = idrx.balanceOf(user);
        assertEq(userBalanceAfter, userBalanceBefore + expectedRefund, "User should receive 15% refund");
    }

    // Tes untuk delay panjang (>= 6 jam) -> 95% refund
    function test_RefundForLongDelay_95_Percent() public {
        uint256 ticketPrice = 1000000 * 1e2; // Rp 1.000.000
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        flightInsurance.mintTicket("User Delay 3", 103, "CGK", "DPS", block.timestamp, ticketPrice);
        vm.stopPrank();

        uint256 tokenId = 1;
        uint256 userBalanceBefore = idrx.balanceOf(user);

        // ACT: Backend melaporkan delay 7 jam
        vm.startPrank(backend);
        flightInsurance.reportFlightStatus(tokenId, FlightInsurance.Status.Delay, 7);
        vm.stopPrank();

        // ASSERT: Verifikasi refund 95%
        uint256 expectedRefund = (ticketPrice * 95) / 100; // 950.000 IDRX
        uint256 userBalanceAfter = idrx.balanceOf(user);
        assertEq(userBalanceAfter, userBalanceBefore + expectedRefund, "User should receive 95% refund");
    }

    function test_OwnerCanWithdrawFunds() public {
        // ARRANGE: Simulasikan sebuah transaksi yang meninggalkan sisa dana di kontrak.
        // Dalam kasus ini, tiket seharga 1jt IDRX dibatalkan, refund 950rb, sisa 50rb.
        uint256 ticketPrice = 1000000 * 1e2; // Rp 1.000.000
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), ticketPrice);
        flightInsurance.mintTicket("Test Withdraw", 999, "SUB", "JOG", block.timestamp, ticketPrice);
        vm.stopPrank();
        
        // Backend melaporkan pembatalan
        vm.startPrank(backend);
        flightInsurance.reportFlightStatus(1, FlightInsurance.Status.Cancelled, 0);
        vm.stopPrank();

        // Saldo awal owner sebelum menarik dana
        uint256 ownerBalanceBefore = idrx.balanceOf(backend);
        uint256 contractBalance = idrx.balanceOf(address(flightInsurance));
        
        // Pastikan ada sisa dana di kontrak (5% dari harga tiket)
        assertEq(contractBalance, (ticketPrice * 5) / 100);

        // ACT: Owner memanggil fungsi withdrawFunds
        vm.startPrank(backend);
        flightInsurance.withdrawFunds();
        vm.stopPrank();

        // ASSERT: Verifikasi hasilnya
        // 1. Saldo kontrak harus kembali menjadi 0
        assertEq(idrx.balanceOf(address(flightInsurance)), 0, "Contract balance should be zero after withdrawal");

        // 2. Saldo owner harus bertambah sebesar sisa dana di kontrak
        uint256 ownerBalanceAfter = idrx.balanceOf(backend);
        assertEq(ownerBalanceAfter, ownerBalanceBefore + contractBalance, "Owner should receive the contract balance");
    }

    // Tes keamanan: memastikan user biasa GAGAL menarik dana
    function test_FailIfNonOwnerWithdrawsFunds() public {
        // ARRANGE: Pastikan ada dana di kontrak
        vm.startPrank(user);
        idrx.approve(address(flightInsurance), 1e6);
        flightInsurance.mintTicket("Test Fail", 1, "A", "B", 1, 1e6);
        vm.stopPrank();

        // ACT & ASSERT: Harapkan transaksi revert jika user mencoba withdraw
        vm.startPrank(user); // Aktornya adalah user (tidak sah)
        vm.expectRevert(); // Kita hanya perlu tahu ini gagal, pesan error tidak spesifik seperti Ownable
        flightInsurance.withdrawFunds();
        vm.stopPrank();
    }
}