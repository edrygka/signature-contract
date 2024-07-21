const { expect } = require("chai");
const { ethers } = require("hardhat");
const { generateSignature } = require("../scripts/signature");

describe("BankContract", function () {
    let BankContract;
    let bankContract;
    let TestToken;
    let testToken;
    let owner;
    let user;
    let amount = ethers.parseUnits("100", 18);

    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();

        TestToken = await ethers.getContractFactory("TestToken");
        testToken = await TestToken.deploy(ethers.parseUnits("1000000", 18));
        await testToken.waitForDeployment();

        BankContract = await ethers.getContractFactory("Bank");
        bankContract = await BankContract.deploy(testToken.target);
        await bankContract.waitForDeployment();

        await testToken.transfer(bankContract.target, ethers.parseUnits("100000", 18));
    });

    it("Should allow a valid claim", async function () {
        const nonce = await bankContract.nonces(user.address);
        const { v, r, s } = await generateSignature(user.address, amount, nonce, owner);

        await expect(bankContract.connect(user).claimReward(amount, v, r, s))
            .to.emit(bankContract, "RewardPaid")
            .withArgs(user.address, amount, nonce);

        expect(await testToken.balanceOf(user.address)).to.equal(amount);
    });

    it("Should not allow a claim with an invalid signature", async function () {
        const nonce = await bankContract.nonces(user.address);
        const { v, r, s } = await generateSignature(user.address, amount, nonce, user);

        await expect(bankContract.connect(user).claimReward(amount, v, r, s))
            .to.be.revertedWith("Invalid signature");
    });

    it("Should not allow a claim with the same signature twice", async function () {
        const nonce = await bankContract.nonces(user.address);
        const { v, r, s } = await generateSignature(user.address, amount, nonce, owner);

        await expect(bankContract.connect(user).claimReward(amount, v, r, s))
            .to.emit(bankContract, "RewardPaid")
            .withArgs(user.address, amount, nonce);

        await expect(bankContract.connect(user).claimReward(amount, v, r, s))
            .to.be.revertedWith("Invalid signature");
    });
});
