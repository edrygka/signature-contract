# Signature contract

To fetch events run:
```shell
node scripts/fetchEvents.js 
```

To Generate signature, run:
```shell
node scripts/generateSig.js
```

To run tests:
```shell
npm test
```

To deploy and verify contract run this:

```shell
npx hardhat run scripts/deployBank.js --network amoy
npx hardhat verify TOKEN_ADDRESS INITIAL_SUPPLY --network amoy
npx hardhat verify BANK_ADDRESS TOKEN_ADDRESS --network amoy
```
