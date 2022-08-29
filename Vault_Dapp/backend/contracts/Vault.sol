// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GoldToken is ERC20, ERC20Burnable {
    constructor(uint256 initialSupply) ERC20("Gold", "GLD") {
        _mint(msg.sender, initialSupply);
    }
}

/*
-> We should have a mint function to deposit 
-> We should also have a deposit function to deposit tokens that the ERC20 contract approves us to use
-> We should have a withdraw function which requires a burn function
*/

contract Vault {
    IERC20 public immutable token;
    uint256 public totalSupply;

    mapping (address => uint256) public balanceOf;
    
    constructor(address _token) {
        token = IERC20(_token);
    }

    // When we mint we increment(add)
    function mint(address _to, uint256 _shares) private {
        totalSupply += _shares;
        balanceOf[_to] += _shares;
    }

    // When we burn we decrement or just remove
    function burn(address _from, uint256 _shares) private {
        totalSupply -= _shares;
        balanceOf[_from] -= _shares;
    }

    function deposit(uint256 _amount) external {
         /*
        a = amount
        B = balance of token before deposit
        T = total supply
        s = shares to mint

        (T + s) / T = (a + B) / B 

        s = aT / B
        */
        uint256 shares;
        if (totalSupply == 0) {
            shares = _amount;
        }
        else {
            shares = (_amount * totalSupply) / token.balanceOf(address(this));
        }
        mint(msg.sender, shares);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function withdraw(uint256 _shares) public {
        /*
        a = amount
        B = balance of token before withdraw
        T = total supply
        s = shares to burn

        (T - s) / T = (B - a) / B 

        a = sB / T
        */
        uint256 _amount = (_shares * token.balanceOf(address(this))) / totalSupply;
        burn(msg.sender, _shares);
        token.transfer(msg.sender, _amount);
    }

}