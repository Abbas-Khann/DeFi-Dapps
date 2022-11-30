// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";

contract MyToken is Staking721Base {

    // This contract allows users to stake their nft for 30 days
    // User can only withdraw their NFT after 30 days of time limit is reached
    // User can earn staking rewards anytime
        
      uint256 lockTime = block.timestamp + 30 days;
      event Withdraw(address withdrawer, bool successfull);

      constructor(
        address _nftCollection,
        address _rewardToken
        )
        Staking721Base(
            lockTime,
            100,
            address(_nftCollection),
            address(_rewardToken) 
        )
    {}
    

    function _withdraw(uint256[] calldata _tokenIds) internal override {
        uint256 _amountStaked = stakers[msg.sender].amountStaked;
        uint256 len = _tokenIds.length;
        require(len != 0, "Withdrawing 0 tokens");
        require(_amountStaked >= len, "Withdrawing more than staked");

        address _nftCollection = nftCollection;

        _updateUnclaimedRewardsForStaker(msg.sender);

        if (_amountStaked == len) {
            for (uint256 i = 0; i < stakersArray.length; ++i) {
                if (stakersArray[i] == msg.sender) {
                    stakersArray[i] = stakersArray[stakersArray.length - 1];
                    stakersArray.pop();
                }
            }
        }
        stakers[msg.sender].amountStaked -= len;

        for (uint256 i = 0; i < len; ++i) {
            require(stakerAddress[_tokenIds[i]] == msg.sender, "Not staker");
            stakerAddress[_tokenIds[i]] = address(0);
            IERC721(_nftCollection).transferFrom(address(this), msg.sender, _tokenIds[i]);
        }

        emit TokensWithdrawn(msg.sender, _tokenIds);
    }

        modifier onlyAfterTimeLimit {
        require(
            block.timestamp >= lockTime,
            "You can't withdraw unless your 30 days are completed!"
        );
        _;
    }

    function withdrawNFT(uint256[] calldata _tokenIds) external onlyAfterTimeLimit {
        _withdraw(_tokenIds);
        emit Withdraw(msg.sender, true);
    }

    function returnLockedTime() public view returns(uint256) {
        return lockTime;
    }

}