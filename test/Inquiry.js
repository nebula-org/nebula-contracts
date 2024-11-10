const hre = require("hardhat")
require("dotenv").config(); // Load environment variables

const { ARBITRUM_SEPOLIA_USD, ARBITRUM_SEPOLIA_INQUIRY, PRIVATE_KEY } = process.env;

const INQUIRY_ADDR = ARBITRUM_SEPOLIA_INQUIRY
const USD_ADDR = ARBITRUM_SEPOLIA_USD


const addProduct = async () => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    const productId = await inquiry.addProduct("Term Life Insurance",
        "Nebula's test product",
        ["Accidental Health", "Total Permanent Disability"])
    console.log("ProductId: ", productId)
}

const addQuote = async (prodId = 0, premium, sum) => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    let quoteId

    quoteId = await inquiry.addQuoteToProduct(prodId, sum, premium, "1 year", 1)
    console.log("QuoteId: ", quoteId)


}

const setToken = async () => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    await inquiry.setToken(USD_ADDR)
}

const getBalance = async () => {
    const usd = await hre.ethers.getContractAt("NebulaUSD", USD_ADDR)
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const sender = await signer2.getAddress()
    const sender = "0x90Eef6b95Cc0aE0cd8435377bA51BA89da53079d"
    const balance = await usd.balanceOf(sender)
    console.log("Balance: ", balance)
}

const getAllowance = async () => {
    const usd = await hre.ethers.getContractAt("NebulaUSD", USD_ADDR)
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const sender = await signer2.getAddress()
    const sender = "0x90Eef6b95Cc0aE0cd8435377bA51BA89da53079d"
    const balance = await usd.allowance(sender, INQUIRY_ADDR)
    console.log("Balance: ", balance)
}

const approve = async () => {
    const usd = await hre.ethers.getContractAt("NebulaUSD", USD_ADDR)
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    await usd.connect(signer2).approve(INQUIRY_ADDR, 10)
}


const transferTokensToSigner2 = async () => {
    const usd = await hre.ethers.getContractAt("NebulaUSD", USD_ADDR)
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const recepient = await signer2.getAddress()
    const recepient = "0x90Eef6b95Cc0aE0cd8435377bA51BA89da53079d"
    const senderPrivateKey = PRIVATE_KEY
    const signer = new hre.ethers.Wallet(senderPrivateKey, ethers.provider);
    // await usd.connect(signer0).transfer(recepient, 100)
    await usd.connect(signer).transfer(recepient, 100)
}

// const approveTransfer = async () => {
//     await inquiry.approveTokenTransfer(0, 0)
// }

const createInquiry = async () => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    const docs = {
        idProof: "YGz0Mav66Nrvgzk2DvNqwu21MeqKGxLhQlLU6T8NAKU",
        ageProof: "d73LJESi9ixDF3fgCJ3Z1WVo4fxvgKpDBktqDhUfcgc",
        addressProof: "9V6NH0-EcxyAMf46BVy5xB7_hF1KgRt7dRFzA0S3Ec8",
        financialProof: "qhT0nqvGPgjj-ClTjvA7ya0u4Gqu_8du5qXBsQkwwg8"
    }
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const address0 = await signer0.getAddress()
    const inquiryId = await inquiry.connect(signer2).createPolicyInquiry(
        "basic",
        docs,
        0,
        0,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "wife"
    )
    console.log("Inquiry id: ", inquiryId)
    return inquiryId
}

const buy = async () => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    await inquiry.connect(signer2).buyPolicy()
}

const viewProductQuotes = async (prodId = 0) => {
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    const quotes = await inquiry.getQuotes(prodId)
    console.log("Quotes: ", quotes)
}

async function main() {
    // const code = await hre.ethers.provider.getCode(EP_ADDR)
    // console.log(code)
    const inquiry = await hre.ethers.getContractAt("Inquiry", INQUIRY_ADDR)
    // const owner = await inquiry.owner()
    // console.log(owner)

    // let productCount = await inquiry.products.length
    // console.log(productCount)

    // const productId = await inquiry.addProduct("Term Life Insurance",
    //     "Nebula's test product",
    //     ["Accidental Health", "Total Permanent Disability", "Chronic Illness", "Death"])
    // console.log("ProductId: ", productId)

    // // productCount = await inquiry.products.length
    // // console.log(productCount)

    // // const product = await inquiry.products(0)
    // // console.log("Product: ", product)

    // const quoteId = await inquiry.addQuoteToProduct(0, 40, 4, "1 year", 1)
    // console.log("QuoteId: ", quoteId)

    // const product = await inquiry.products(0)
    // console.log("product-quote: ", product)

    // const quotes = await inquiry.getQuotes(0)
    // console.log("Quotes: ", quotes)
    // const details = {
    //     gender: "M", age: 30, education: "bachelors", income: 2000, occupation: "actuary"
    // }
    // const docs = {
    //     idProof: "YGz0Mav66Nrvgzk2DvNqwu21MeqKGxLhQlLU6T8NAKU",
    //     ageProof: "d73LJESi9ixDF3fgCJ3Z1WVo4fxvgKpDBktqDhUfcgc",
    //     addressProof: "9V6NH0-EcxyAMf46BVy5xB7_hF1KgRt7dRFzA0S3Ec8",
    //     financialProof: "qhT0nqvGPgjj-ClTjvA7ya0u4Gqu_8du5qXBsQkwwg8"
    // }

    // // await inquiry.setToken(USD_ADDR)

    // const inquiryId = await inquiry.createPolicyInquiry(
    //     "",
    //     docs,
    //     0,
    //     0,
    //     "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    //     "wife")

    // console.log("Inquiry id: ", inquiryId)



    // await inquiry.buyPolicy();
    // const policyInquiry = await inquiry.getPolicyInquiries(0)
    // console.log("Inquiry: ", policyInquiry)
    // const [signer0, signer1] = await hre.ethers.getSigners()
    // const address1 = await signer1.getAddress()
    // const approved = await inquiry.isTokenTransferApproved(address1, INQUIRY_ADDR)
    // console.log("is approved", approved)
    // console.log(await inquiry.approveTokenTransfer(0, 0))


    // await setToken()
    // await addProduct()
    // await addQuotes(0)
    // const product = await inquiry.products(0)
    // console.log("product-quote: ", product)
    // const quotes = await inquiry.getQuotes(0)
    // console.log("Quotes: ", quotes)
    // console.log("====================================")
    // const id = await createInquiry()
    // const policyInquiry = await inquiry.getPolicyInquiries(1)
    // console.log("Inquiry: ", policyInquiry)
    // const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const address = await signer2.getAddress()
    // const approved = await inquiry.isTokenTransferApproved(address, 1)
    // console.log("approved ", approved)
    // await transferTokensToSigner2()
    // await getBalance()
    // await approve()
    // await getAllowance()
    // await buy()
    // const policyInquiry = await inquiry.getPolicyInquiries(1)
    // console.log("Inquiry: ", policyInquiry)
    // const [signer0, signer1, signer2] = await hre.ethers.getSigners()
    // const address = await signer1.getAddress()
    // const policy = await inquiry.getPolicyByOwner(address)
    // console.log("policy: ", policy)

    // const policy = await inquiry.getPoliciesByNominee(address)
    // console.log("policy: ", policy)

    // console.log(await inquiry.getQuotes(0))
    // STEPS
    // await setToken();
    // await addProduct()
    // await addQuote(0, 4, 40)
    // await viewProductQuotes(0)

    // const policyInquiry = await inquiry.getPolicyByOwner("0x7D9479936BEeb0473EBA5db34f560eB67Ee816c0")
    // console.log("Inquiry: ", policyInquiry)
    // await getBalance();
    const list = await inquiry.buyPolicy()
    console.log("List: ", list)



}


main().catch(err => {
    console.log(err)
    process.exitCode = 1
})