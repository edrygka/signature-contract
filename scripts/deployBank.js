"use strict"

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TestToken = await ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy(ethers.parseUnits("1000000", 18));
  await testToken.waitForDeployment();

  console.log("TestToken deployed to:", testToken.target);

  const BankContract = await ethers.getContractFactory("Bank");
  const bankContract = await BankContract.deploy(testToken.target);
  await bankContract.waitForDeployment();

  console.log("BankContract deployed to:", bankContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });

// npx hardhat run scripts/deployBank.js --network amoy

// Verify test token contract
// npx hardhat verify 0x64d035155c9eF0b496bB4aE87a104cdff476705b 1000000000000000000000000 --network amoy

// Verify bank contract
// npx hardhat verify 0x0296BC491B1b2D90e67BB5775cf12F52590Bea74 0x64d035155c9eF0b496bB4aE87a104cdff476705b --network amoy
