// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VestedToken is ERC20, Ownable {
    struct VestingSchedule {
        uint256 totalAmount;        // total tokens allocated
        uint256 startTime;          // when vesting starts
        uint256 cliffDuration;      // seconds before anything unlocks
        uint256 vestingDuration;    // total seconds over which tokens unlock
        uint256 claimed;            // how much has already been claimed
    }

    mapping(address => VestingSchedule) public vestingSchedules;
    
    event VestingAdded(address indexed beneficiary, uint256 amount, uint256 cliff, uint256 duration);
    event TokensClaimed(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 remainingAmount);

    constructor(
        string memory name, 
        string memory symbol, 
        uint256 totalSupply, 
        address initialOwner
    ) ERC20(name, symbol) Ownable(initialOwner) {
        _mint(address(this), totalSupply);
    }

    function addVesting(
        address beneficiary, 
        uint256 amount, 
        uint256 cliffDuration, 
        uint256 vestingDuration
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Vesting already exists");
        require(balanceOf(address(this)) >= amount, "Insufficient tokens in contract");

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            startTime: block.timestamp,
            cliffDuration: cliffDuration,
            vestingDuration: vestingDuration,
            claimed: 0
        });

        emit VestingAdded(beneficiary, amount, cliffDuration, vestingDuration);
    }

    function vestedAmount(address beneficiary) public view returns (uint256) {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        if (schedule.totalAmount == 0) return 0;
        if (block.timestamp < schedule.startTime + schedule.cliffDuration) return 0;

        if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
            return schedule.totalAmount;
        }

        uint256 timeElapsed = block.timestamp - schedule.startTime;
        return (schedule.totalAmount * timeElapsed) / schedule.vestingDuration;
    }

    function claimable(address beneficiary) public view returns (uint256) {
        uint256 vested = vestedAmount(beneficiary);
        return vested - vestingSchedules[beneficiary].claimed;
    }

    function claim() external {
        uint256 amount = claimable(msg.sender);
        require(amount > 0, "Nothing to claim");

        vestingSchedules[msg.sender].claimed += amount;
        _transfer(address(this), msg.sender, amount);

        emit TokensClaimed(msg.sender, amount);
    }

    function revokeVesting(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting for beneficiary");

        uint256 unvested = schedule.totalAmount - vestedAmount(beneficiary);
        uint256 unclaimed = schedule.totalAmount - schedule.claimed;
        
        // Return remaining tokens to owner
        _transfer(address(this), owner(), unclaimed);
        
        delete vestingSchedules[beneficiary];
        emit VestingRevoked(beneficiary, unclaimed);
    }
}
