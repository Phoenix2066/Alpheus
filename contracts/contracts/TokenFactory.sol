// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VestedToken.sol";

contract TokenFactory {
    address[] public deployedTokens;
    mapping(address => address[]) public tokensByDeployer;

    event TokenDeployed(address indexed tokenAddress, address indexed deployer, string name, string symbol);

    function deployToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address[] memory beneficiaries,
        uint256[] memory amounts,
        uint256 cliffDuration,
        uint256 vestingDuration
    ) external returns (address) {
        require(beneficiaries.length == amounts.length, "Arrays length mismatch");
        
        // Factory becomes initial owner to add vesting schedules
        VestedToken newToken = new VestedToken(name, symbol, totalSupply, address(this));
        
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            newToken.addVesting(beneficiaries[i], amounts[i], cliffDuration, vestingDuration);
        }

        // Transfer ownership to the deployer
        newToken.transferOwnership(msg.sender);

        address tokenAddress = address(newToken);
        deployedTokens.push(tokenAddress);
        tokensByDeployer[msg.sender].push(tokenAddress);

        emit TokenDeployed(tokenAddress, msg.sender, name, symbol);
        return tokenAddress;
    }

    function getDeployedTokens() external view returns (address[] memory) {
        return deployedTokens;
    }

    function getTokensByDeployer(address deployer) external view returns (address[] memory) {
        return tokensByDeployer[deployer];
    }
}
