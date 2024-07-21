const { ethers } = require("ethers");
require("dotenv").config()

const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

exports.generateSignature = async (userAddress, amount, nonce, signer = null) => {
    const messageHash = ethers.solidityPackedKeccak256(
        ["address", "uint256", "uint256"],
        [userAddress, amount, nonce]
    );
    const messageHashBytes = ethers.getBytes(messageHash);
    const signature = await (signer ?? wallet).signMessage(messageHashBytes);
    const { v, r, s } = ethers.Signature.from(signature);

    return { v, r, s, signature };
}