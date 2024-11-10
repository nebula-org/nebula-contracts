const hre = require("hardhat")
const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const AF_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const FACTORY_NONCE = 1; //contract nonce start at 1


async function main() {
    // CREATE: hash(deployer+ nonce). deployer is AF
    const sender = await hre.ethers.getCreateAddress({
        from: AF_ADDR,
        nonce: FACTORY_NONCE
    })
    const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDR);
    const AccountFactory = await hre.ethers.getContractFactory("AccountFactory")
    const Account = await hre.ethers.getContractFactory("Account")
    const [signer0] = await hre.ethers.getSigners()
    const address0 = await signer0.getAddress()

    // need to run only once or it will create multiple accounts
    const initCode = AF_ADDR +
        AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2)

    //check balance before depositing
    await ep.depositTo(sender, {
        value: hre.ethers.parseEther("100")
    })
    console.log("Sender: ", sender)
    const userOp = {
        sender, // address of smart account
        nonce: await ep.getNonce(sender, 0), // 0 gives sequential
        initCode,
        callData: Account.interface.encodeFunctionData("execute"),
        callGasLimit: 200_000,
        verificationGasLimit: 200_000,
        preVerificationGas: 50_000,
        maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x"
    }
    const tx = await ep.handleOps([userOp], address0)
    const receipt = await tx.wait()
    console.log(receipt)
}

main().catch(err => {
    console.log(err)
    process.exitCode = 1
})