const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying TokenFactory...");

  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const factory = await TokenFactory.deploy();

  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("TokenFactory deployed to:", factoryAddress);

  // Save the address to a file
  const addresses = {
    TokenFactory: factoryAddress,
  };

  const addressesPath = path.join(__dirname, "../../deployedAddresses.json");
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Address saved to deployedAddresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
