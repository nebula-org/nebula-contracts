// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("NebulaUSDModule", (m) => {


    const usd = m.contract("NebulaUSD");

    return { usd };

});


// 0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1

