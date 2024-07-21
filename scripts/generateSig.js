const { generateSignature } = require("./signature");
const fs = require("fs");

const userAddress = "0xf96ccedbE2A8E67134C00c3adbbb1475265e6d00";
const amount = 1000;
const nonce = 1;

generateSignature(userAddress, amount, nonce).then((result) => {
    console.log(result);
    fs.writeFileSync("signature.json", JSON.stringify(result, null, 2));
});
