// sc/src/FlightInsurance.sol (FINAL - SUDAH BERSIH)

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Base64} from "solady/utils/Base64.sol";
import { LibString as Strings } from "solady/utils/LibString.sol";

contract FlightInsurance is ERC721, Ownable, Pausable {
    uint256 private _nextTokenId = 1;

    IERC20 public idrxToken;

    enum Status { Purchased, Delay, Cancelled, Refunded }

    struct TicketInfo {
        uint256 flightId;
        string passengerName;
        string departureCity;
        string destinationCity;
        uint256 departureDate; // Unix timestamp
        uint256 amount;
        Status status;
        uint256 refundAmount;
    }

    mapping(uint256 => TicketInfo) public ticketDetails;

    event TicketMinted(uint256 indexed tokenId, address indexed owner, string passengerName, uint256 flightId);
    event FlightStatusReported(uint256 indexed tokenId, Status newStatus, uint256 refundAmount);
    event RefundProcessed(uint256 indexed tokenId, address indexed owner, uint256 refundAmount);
    event TicketCancelledByUser(uint256 indexed tokenId, address indexed owner);

    constructor(address _idrxToken, address initialOwner)
        ERC721("FlightTicketNFT", "FTN")
        Ownable(initialOwner)
    {
        idrxToken = IERC20(_idrxToken);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function mintTicket(
        string memory passengerName,
        uint256 flightId,
        string memory departureCity,
        string memory destinationCity,
        uint256 departureDate,
        uint256 amount
    ) external whenNotPaused returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(idrxToken.transferFrom(msg.sender, address(this), amount), "IDRX transfer failed");

        uint256 newTokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, newTokenId);
        ticketDetails[newTokenId] = TicketInfo(
            flightId, passengerName, departureCity, destinationCity,
            departureDate, amount, Status.Purchased, 0
        );

        emit TicketMinted(newTokenId, msg.sender, passengerName, flightId);
        return newTokenId;
    }

    function cancelTicket(uint256 tokenId) external whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Caller is not the ticket owner");

        TicketInfo storage t = ticketDetails[tokenId];
        require(t.status == Status.Purchased, "Ticket not in a cancellable state");
        require(block.timestamp < t.departureDate - 24 hours, "Cannot cancel within 24h of flight");

        uint256 refundAmount = (t.amount * 80) / 100;

        t.status = Status.Refunded;
        t.refundAmount = refundAmount;
        
        _burn(tokenId);
        
        require(idrxToken.transfer(msg.sender, refundAmount), "Refund transfer failed");

        emit TicketCancelledByUser(tokenId, msg.sender);
    }

    function reportFlightStatus(uint256 tokenId, Status status, uint256 delayInHours) external onlyOwner whenNotPaused {
        require(ticketDetails[tokenId].amount > 0, "Ticket NFT does not exist");
        
        TicketInfo storage t = ticketDetails[tokenId];
        require(t.status == Status.Purchased, "Ticket already processed");

        uint256 refund = 0;
        if (status == Status.Cancelled) {
            refund = (t.amount * 95) / 100;
        } else if (status == Status.Delay) {
            if (delayInHours >= 6) refund = (t.amount * 95) / 100;
            else if (delayInHours >= 3) refund = (t.amount * 15) / 100;
            else if (delayInHours >= 1) refund = (t.amount * 5) / 100;
        }

        if (refund > 0) {
            address ticketOwner = ownerOf(tokenId);
            t.refundAmount = refund;
            t.status = Status.Refunded;
            require(idrxToken.transfer(ticketOwner, refund), "IDRX refund failed");
            emit RefundProcessed(tokenId, ticketOwner, refund);
        }

        emit FlightStatusReported(tokenId, status, refund);
    }
    
    function withdrawFunds() external onlyOwner whenNotPaused {
        uint256 balance = idrxToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        require(idrxToken.transfer(owner(), balance), "Withdrawal failed");
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ticketDetails[tokenId].amount > 0, "URI query for nonexistent token");
        TicketInfo memory info = ticketDetails[tokenId];
        string memory json = Base64.encode(
            bytes(string.concat(
                '{"name": "Flight Ticket #', Strings.toString(tokenId), '", ',
                '"description": "Digital flight ticket with automated insurance.", ',
                '"attributes": [',
                '{"trait_type": "Passenger", "value": "', info.passengerName, '"},',
                '{"trait_type": "Flight ID", "value": "', Strings.toString(info.flightId), '"},',
                '{"trait_type": "Route", "value": "', info.departureCity, ' to ', info.destinationCity, '"},',
                '{"trait_type": "Departure Date", "value": "', Strings.toString(info.departureDate), '"}]}'
            ))
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function getTicketInfo(uint256 tokenId) external view returns (TicketInfo memory) {
        require(ticketDetails[tokenId].amount > 0, "Query for nonexistent token");
        return ticketDetails[tokenId];
    }
}