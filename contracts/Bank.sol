// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Pausable, Ownable {
    IERC20 public rewardToken;
    mapping(address => uint256) public nonces;

    event RewardPaid(address indexed user, uint256 amount, uint256 nonce);
    event TokenUpdated(address indexed newToken);

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
    }

    function updateRewardToken(address _newToken) external onlyOwner {
        rewardToken = IERC20(_newToken);
        emit TokenUpdated(_newToken);
    }

    function claimReward(uint256 amount, uint8 v, bytes32 r, bytes32 s) external whenNotPaused {
        address user = msg.sender;
        uint256 nonce = nonces[user];

        bytes32 message = keccak256(abi.encodePacked(user, amount, nonce));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));

        // Recover the signer address
        address signer = ecrecover(ethSignedMessageHash, v, r, s);
        require(signer == owner(), "Invalid signature");

        nonces[user]++;

        require(rewardToken.transfer(user, amount), "Reward transfer failed");

        emit RewardPaid(user, amount, nonce);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
