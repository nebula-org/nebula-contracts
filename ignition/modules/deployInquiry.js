// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("InquiryModule", (m) => {


    const inquiry = m.contract("Inquiry");

    return { inquiry };

});

// npx hardhat clean
// npx hardhat compile

// 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9


