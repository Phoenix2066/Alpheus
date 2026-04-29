const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Alpheus", function () {
  let TokenFactory, factory, VestedToken;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    TokenFactory = await ethers.getContractFactory("TokenFactory");
    factory = await TokenFactory.deploy();
  });

  it("Should deploy a new token and set up vesting", async function () {
    const name = "Test Token";
    const symbol = "TEST";
    const totalSupply = ethers.parseEther("1000");
    const beneficiaries = [addr1.address];
    const amounts = [ethers.parseEther("100")];
    const cliff = 60; // 1 minute
    const duration = 300; // 5 minutes

    const tx = await factory.deployToken(name, symbol, totalSupply, beneficiaries, amounts, cliff, duration);
    const receipt = await tx.wait();
    
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'TokenDeployed');
    const tokenAddress = event.args.tokenAddress;

    const token = await ethers.getContractAt("VestedToken", tokenAddress);
    expect(await token.name()).to.equal(name);
    expect(await token.symbol()).to.equal(symbol);
    expect(await token.balanceOf(tokenAddress)).to.equal(totalSupply);

    const schedule = await token.vestingSchedules(addr1.address);
    expect(schedule.totalAmount).to.equal(amounts[0]);
  });

  it("Should allow claiming after cliff", async function () {
    const name = "Test Token";
    const symbol = "TEST";
    const totalSupply = ethers.parseEther("1000");
    const beneficiaries = [addr1.address];
    const amounts = [ethers.parseEther("100")];
    const cliff = 60;
    const duration = 300;

    const tx = await factory.deployToken(name, symbol, totalSupply, beneficiaries, amounts, cliff, duration);
    const receipt = await tx.wait();
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'TokenDeployed');
    const tokenAddress = event.args.tokenAddress;
    const token = await ethers.getContractAt("VestedToken", tokenAddress);

    // Initial claimable should be 0
    expect(await token.claimable(addr1.address)).to.equal(0);

    // Fast forward time past cliff
    await ethers.provider.send("evm_increaseTime", [70]);
    await ethers.provider.send("evm_mine");

    const claimable = await token.claimable(addr1.address);
    expect(claimable).to.be.gt(0);

    await token.connect(addr1).claim();
    const balance = await token.balanceOf(addr1.address);
    expect(balance).to.be.at.least(claimable);
  });
});
