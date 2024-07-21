const { ethers } = require("ethers");
const fs = require("fs");
require("dotenv").config()

const provider = new ethers.JsonRpcProvider(`https://polygon-amoy.infura.io/v3/${process.env.INFURA_API_KEY}`);
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const abi = [
    "event RewardPaid(address indexed user, uint256 amount, uint256 nonce)"
];

const contract = new ethers.Contract(contractAddress, abi, provider);

async function fetchEvents() {
    const filter = contract.filters.RewardPaid();
    const events = await contract.queryFilter(filter);

    const eventDetails = events.map(event => {
        return {
            user: event.args.user,
            amount: event.args.amount.toString(),
            nonce: event.args.nonce.toString()
        };
    });

    fs.writeFileSync("events.json", JSON.stringify(eventDetails, null, 2));
}

// Run the script
fetchEvents();
