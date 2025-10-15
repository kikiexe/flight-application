// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract IDRS is ERC20, Ownable {
    // Mengganti nama dan simbol token
    constructor() ERC20("IDR Stable", "IDRS") Ownable(msg.sender) {
        // Mint 10 juta token untuk deployer saat awal, cukup untuk tes
        _mint(msg.sender, 10_000_000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}