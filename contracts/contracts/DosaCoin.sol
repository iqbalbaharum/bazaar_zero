// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DosaCoin is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("DosaCoin", "DOSACOIN") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
