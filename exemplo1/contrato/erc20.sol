// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Serpro is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("Serpro", "SRP")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transferirValor(address from, address to, uint256 value) public onlyOwner  {
        _transfer(from, to, value);
    }
}
