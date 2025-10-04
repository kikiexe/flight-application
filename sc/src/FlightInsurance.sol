// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "solady/utils/Base64.sol";

contract FlightInsurance is ERC721, Ownable {
    uint256 private _nextTokenId = 1;

    IERC20 public idrxToken; // Menggunakan IDRX

    enum Status { Purchased, Delay, Cancelled, Refunded }

    struct TicketInfo {
        uint256 flightId;
        string passengerName;
        string departureCity;
        string destinationCity;
        uint256 departureDate;
        uint256 amount;
        Status status;
        uint256 refundAmount;
    }

    mapping(uint256 => TicketInfo) public ticketDetails;

    event TicketMinted(uint256 indexed tokenId, address indexed owner, string passengerName, uint256 flightId);
    event FlightStatusReported(uint256 indexed tokenId, Status originalStatus, uint256 refundAmount);
    event RefundProcessed(uint256 indexed tokenId, address indexed owner, uint256 refundAmount);

    constructor(address _idrxToken, address initialOwner) 
        ERC721("FlightTicketNFT", "FTN")
        Ownable(initialOwner) 
    {
        idrxToken = IERC20(_idrxToken);
    }

    function mintTicket(
        string memory passengerName,
        uint256 flightId,
        string memory departureCity,
        string memory destinationCity,
        uint256 departureDate,
        uint256 amount
    ) external returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(idrxToken.transferFrom(msg.sender, address(this), amount), "IDRX transfer failed");

        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, newTokenId);

        ticketDetails[newTokenId] = TicketInfo(
            flightId,
            passengerName,
            departureCity,
            destinationCity,
            departureDate,
            amount,
            Status.Purchased,
            0
        );

        emit TicketMinted(newTokenId, msg.sender, passengerName, flightId);
        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ticketDetails[tokenId].amount > 0, "URI query for nonexistent token");
        TicketInfo memory info = ticketDetails[tokenId];

        string memory json = Base64.encode(
            bytes(
                string.concat(
                    '{"name": "Flight Ticket #', Strings.toString(tokenId), '", ',
                    '"description": "Digital flight ticket with automated insurance.", ',
                    '"attributes": [',
                        '{"trait_type": "Passenger", "value": "', info.passengerName, '"},',
                        '{"trait_type": "Flight ID", "value": "', Strings.toString(info.flightId), '"},',
                        '{"trait_type": "Route", "value": "', info.departureCity, ' to ', info.destinationCity, '"},',
                        '{"trait_type": "Departure Date", "value": "', Strings.toString(info.departureDate), '"}]}'
                )
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

        function getTicketInfo(uint256 tokenId) external view returns (TicketInfo memory) {
        return ticketDetails[tokenId];
    }

     function reportFlightStatus(uint256 tokenId, Status status, uint256 delayInHours) external onlyOwner {
        TicketInfo storage t = ticketDetails[tokenId];
        require(ownerOf(tokenId) != address(0), "Ticket NFT does not exist");
        require(t.status == Status.Purchased, "Ticket already processed");

        uint256 refund = 0;

        if (status == Status.Cancelled) {
            refund = (t.amount * 95) / 100; // 95% untuk pembatalan
        } else if (status == Status.Delay) {
            if (delayInHours >= 6) {
                // Delay 6 jam atau lebih sama dengan batal
                refund = (t.amount * 95) / 100; // 95%
            } else if (delayInHours >= 3) {
                // Delay 3-5 jam
                refund = (t.amount * 15) / 100; // 15%
            } else if (delayInHours >= 1) {
                // Delay 1-2 jam
                refund = (t.amount * 5) / 100; // 5%
            }
        }

        if (refund > 0) {
            address owner = ownerOf(tokenId);
            require(idrxToken.transfer(owner, refund), "IDRX refund failed");
            t.refundAmount = refund;
            t.status = Status.Refunded;
            emit RefundProcessed(tokenId, owner, refund);
        }

        emit FlightStatusReported(tokenId, status, refund);
    }

     /**
     * @notice Memungkinkan owner untuk menarik saldo IDRX kontrak.
     * @dev Ini digunakan agar bisnis dapat mengumpulkan pendapatan dari penerbangan
     * yang sukses atau sisa persentase dari refund.
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = idrxToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        
        // Transfer seluruh saldo kontrak ke dompet owner
        address contractOwner = owner();
        require(idrxToken.transfer(contractOwner, balance), "Withdrawal failed");
    }
}