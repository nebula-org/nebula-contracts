const hre = require("hardhat")
const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const AF_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const ACCOUNT_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"

async function main() {
    // const code = await hre.ethers.provider.getCode(EP_ADDR)
    // console.log(code)
    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR)
    const count = await account.count()
    console.log(count)
}

main().catch(err => {
    console.log(err)
    process.exitCode = 1
})