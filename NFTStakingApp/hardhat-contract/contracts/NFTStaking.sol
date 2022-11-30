// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";

contract MyToken is Staking721Base {

    // This contract allows users to stake their nft for 30 days
    // User can only withdraw their NFT after 30 days of time limit is reached
    // User can earn staking rewards anytime
        
      uint256 lockTime = block.timestamp + 30 days;
      event Withdraw(address withdrawer, bool successfull);
      event NewTimeUnit(uint256 newTime);

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


    // withdrawing the _setTimeUnit function here
    function _setTimeUnit(uint256 _lockTime) internal override {
        lockTime = _lockTime;
    }

    // changing the locktie state back to 30 days or more since we don't want the
    // the user to keep deploying a new contract and they can just stake the nft within
    // the same contract again after the first 30 days are over
    function setTimeUnit(uint256 _lockTime) external {
        require(
            _lockTime >= block.timestamp + 30 days,
            "The time you set should be greater than or equal to 30 days"
        );
        _setTimeUnit(_lockTime);
        emit NewTimeUnit(newTime);
    }
    

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