

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables

const { PRIVATE_KEY, ALCHEMY_API_KEY } = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localhost",
  networks: {
    arbitrumSepolia: {
      url: `https://arb-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // RPC URL for Arbitrum Sepolia
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
};
