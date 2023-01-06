// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";

contract MyToken is Staking721Base {

    // This contract allows users to stake their nft for 30 days
    // User can only withdraw their NFT after 30 days of time limit is reached
    // User can earn and claim their staking rewards anytime
        
      mapping (uint256 => bool) public nftLocked;
      mapping (uint256 => uint256) public nftLockTime;

      constructor(
        uint256 _timeUnit,
        address _nftCollection,
        address _rewardToken
        )
        Staking721Base(
            uint256(1 days),
            100,
            address(_nftCollection),
            address(_rewardToken) 
        )
    {}

    function _stake(uint256[] calldata _tokenIds) internal override {
        super._stake(_tokenIds);
        for (uint i = 0; i < _tokenIds.length; i++) {
            nftLocked[_tokenIds[i]] = true;
            nftLockTime[_tokenIds[i]] = block.timestamp + 30 days;
        }
    }

     function stakeNft(uint256[] calldata _tokenIds) public {
        _stake(_tokenIds);
    }

    function _withdraw(uint256[] calldata _tokenIds) internal override {
        super._withdraw(_tokenIds);
        for(uint i = 0; i < _tokenIds.length; i++) {
         require(
            block.timestamp > nftLockTime[_tokenIds[i]],
            "You can't withdraw unless your 30 days are completed!"
            );
            nftLocked[_tokenIds[i]] = false;
        }
    }

    function withdrawNFT(uint256[] calldata _tokenIds) public {
        _withdraw(_tokenIds);
    }

}

