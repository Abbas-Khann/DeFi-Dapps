// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/Staking721Base.sol";

contract MyToken is Staking721Base {

    // This contract allows users to stake their nft for 30 days
    // User can only withdraw their NFT after 30 days of time limit is reached
    // User can earn staking rewards anytime
        
      mapping (uint256 => bool) public nftLocked;
      mapping (uint256 => uint256) public nftLockTime;

      constructor(
        uint256 _timeUnit,
        address _nftCollection,
        address _rewardToken
        )
        Staking721Base(
            uint256(_timeUnit),
            100,
            address(_nftCollection),
            address(_rewardToken) 
        )
    {}

    function _stake(uint256[] calldata _tokenIds) internal override {
        uint256 len = _tokenIds.length;
        require(len != 0, "Staking 0 tokens");

        address _nftCollection = nftCollection;

        if (stakers[msg.sender].amountStaked > 0) {
            _updateUnclaimedRewardsForStaker(msg.sender);
        } else {
            stakersArray.push(msg.sender);
            stakers[msg.sender].timeOfLastUpdate = block.timestamp;
        }
        for (uint256 i = 0; i < len; ++i) {
            require(
                IERC721(_nftCollection).ownerOf(_tokenIds[i]) == msg.sender &&
                    (IERC721(_nftCollection).getApproved(_tokenIds[i]) == address(this) ||
                        IERC721(_nftCollection).isApprovedForAll(msg.sender, address(this))),
                "Not owned or approved"
            );
            IERC721(_nftCollection).transferFrom(msg.sender, address(this), _tokenIds[i]);
            stakerAddress[_tokenIds[i]] = msg.sender;

            if (!isIndexed[_tokenIds[i]]) {
                isIndexed[_tokenIds[i]] = true;
                indexedTokens.push(_tokenIds[i]);
            }
            nftLocked[_tokenIds[i]] = true;
            nftLockTime[_tokenIds[i]] = block.timestamp + 10 minutes;
        }
        stakers[msg.sender].amountStaked += len;
        emit TokensStaked(msg.sender, _tokenIds);
    }

    function stakeNft(uint256[] calldata _tokenIds) external {
        _stake(_tokenIds);
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
            require(
            block.timestamp > nftLockTime[_tokenIds[i]],
            "You can't withdraw unless your 30 days are completed!"
            );
            nftLocked[_tokenIds[i]] = false;
            stakerAddress[_tokenIds[i]] = address(0);
            IERC721(_nftCollection).transferFrom(address(this), msg.sender, _tokenIds[i]);
        }

        emit TokensWithdrawn(msg.sender, _tokenIds);
    }

    function withdrawNFT(uint256[] calldata _tokenIds) external {
        _withdraw(_tokenIds);
    }

}