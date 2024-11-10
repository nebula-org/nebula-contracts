// SPDX-License-Identifier: MIT
pragma solidity 0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Inquiry {
    // Enum for premium frequency
    enum PremiumFrequency {
        Monthly,
        Yearly
    }

    enum PolicyStatus {
        Pending,
        Active,
        Expired,
        Closed
    }

    struct PolicyDocuments {
        string idProof;
        string ageProof;
        string addressProof;
        string financialProof;
        string mergedProof;
    }

    struct PolicyDates {
        uint256 start;
        uint256 expiry;
    }

    struct PolicyInquiry {
        string basicDetails;
        PolicyDocuments docs;
        uint256 productId;
        bool hasApproved;
        address nominee;
        string relationship;
        PolicyStatus status;
        uint256 quoteId;
        uint256 premiumPaid;
        uint256 premium;
        uint256 sumAssured;
    }

    mapping(uint256 => PolicyDates) private policyExpiry;

    // Mapping to store PolicyInquiry by an identifier (e.g., user address or unique ID)
    mapping(address => PolicyInquiry) private policyInquiries;

    //to check if inquiry exists
    mapping(address => bool) public exists;

    //to check if inquiry exists for nominee
    mapping(address => bool) public nomineeExists;

    // Mapping to store PolicyInquiry by nominee (e.g., user address or unique ID)
    mapping(address => PolicyInquiry) private policyInquiriesByNominee;

    address public owner;

    constructor() {
        owner = msg.sender; // Set the contract creator as the owner
    }

    // Struct for Quote
    struct Quote {
        uint256 id;
        uint256 sumAssured; // Amount assured
        uint256 premium; // Premium amount
        string term; // // Term in years
        PremiumFrequency frequency; // Frequency of premium payment
    }

    // Struct for Product
    struct Product {
        uint256 id; // Identifier or number for the product
        string title; // Title of the product
        string description; // Description of the product
        string[] tags; // Array of tags for the product
        // Quote[] quotes;            // Array of quotes associated with the product
    }

    struct ProductMeta {
        uint256 productId;
        uint256 quoteId;
    }

    // Example array to store products
    Product[] public products;

    address public tokenAddress;

    PolicyInquiry[] public listOfInquiries;

    mapping(uint256 => Quote[]) public productQuotes;

    event TokensReceived(address sender, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function getExpiry(
        uint256 inquiryId
    ) public view returns (PolicyDates memory) {
        require(
            inquiryId >= 0 && inquiryId < listOfInquiries.length,
            "Invalid Inquiry Id"
        );
        return policyExpiry[inquiryId];
    }

    function getQuotes(
        uint256 productId
    ) public view returns (Quote[] memory quotes) {
        require(
            productId >= 0 && productId < products.length,
            "Invalid Product Id"
        );
        return productQuotes[productId];
    }

    function getPolicyInquiries(
        uint256 inquiryId
    ) external view returns (PolicyInquiry memory inquiry) {
        require(
            inquiryId >= 0 && inquiryId < listOfInquiries.length,
            "Invalid Inquiry Id"
        );
        return listOfInquiries[inquiryId];
    }

    function getPolicyByOwner(
        address _owner
    ) external view returns (PolicyInquiry memory policy) {
        require(exists[_owner], "No inquiry exists for user");
        return policyInquiries[_owner];
    }

    function getPoliciesByNominee(
        address _nominee
    ) external view returns (PolicyInquiry memory policies) {
        require(nomineeExists[_nominee], "No inquiry exists for user");
        return policyInquiriesByNominee[_nominee];
    }

    function addQuoteToProduct(
        uint256 productId,
        uint256 _sumAssured,
        uint256 _premium,
        string memory _term,
        PremiumFrequency _freq
    ) external onlyOwner returns (uint256 quoteId) {
        require(
            productId >= 0 && productId < products.length,
            "Invalid Product Id"
        );
        quoteId = productQuotes[productId].length;
        Quote memory newQuote = Quote({
            id: quoteId,
            sumAssured: _sumAssured,
            premium: _premium,
            term: _term,
            frequency: _freq
        });

        productQuotes[productId].push(newQuote);
    }

    // Function to add a new product
    function addProduct(
        string memory _title,
        string memory _description,
        string[] memory _tags
    ) public onlyOwner returns (uint256 productId) {
        productId = products.length;
        Product memory newProduct = Product({
            id: productId,
            title: _title,
            description: _description,
            tags: _tags
        });
        // productQuotes[productId] = [];

        products.push(newProduct);
    }

    function setToken(address _token) external onlyOwner {
        tokenAddress = _token;
    }

    function checkExists(address _address) public view returns (bool) {
        return exists[_address];
    }

    function isTokenTransferApproved(
        address _owner,
        uint256 amount
    ) public view returns (bool) {
        IERC20 erc20Token = IERC20(tokenAddress);
        uint256 allowedAmount = erc20Token.allowance(_owner, address(this));
        return allowedAmount >= amount;
    }

    function closePolicy() external {
        require(checkExists(msg.sender), "Inquiry doesn't exist exists");
        policyInquiries[msg.sender].status = PolicyStatus.Closed;
    }

    function collectPremium() public {
        require(checkExists(msg.sender), "Inquiry doesn't exist exists");
        require(
            policyInquiries[msg.sender].status == PolicyStatus.Active,
            "Policy is not active"
        );
        uint256 amount = policyInquiries[msg.sender].premium;
        require(
            isTokenTransferApproved(msg.sender, amount),
            "Token transfer is not approved"
        );
        IERC20 erc20Token = IERC20(tokenAddress);
        require(
            erc20Token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        policyInquiries[msg.sender].premiumPaid += amount;
        emit TokensReceived(msg.sender, amount);
    }

    function buyPolicy() external {
        require(checkExists(msg.sender), "Inquiry doesn't exist exists");
        require(
            policyInquiries[msg.sender].status == PolicyStatus.Pending,
            "Policy Inquiry is not ready to be active"
        );
        policyInquiries[msg.sender].status = PolicyStatus.Active;
        collectPremium();
    }

    function approveTokenTransfer(
        uint256 _productId,
        uint256 _quoteId
    ) public returns (bool status) {
        IERC20 token = IERC20(tokenAddress);
        status = token.approve(
            address(this),
            productQuotes[_productId][_quoteId].premium
        );
        if (status == true) {
            policyInquiries[msg.sender].hasApproved = true;
            // policyInquiriesByNominee[listOfInquiries[_inquiryId].nominee]
            //     .hasApproved = true;
            // listOfInquiries[_inquiryId].hasApproved = true;
        }
    }

    // Function to create a new policy inquiry
    function createPolicyInquiry(
        string memory _basicDetails,
        // string memory _idProof,
        // string memory _ageProof,
        // string memory _addressProof,
        // string memory _financialProof,
        PolicyDocuments memory _docs,
        ProductMeta memory product,
        address _nominee,
        string memory _relationship
    ) public {
        require(!checkExists(msg.sender), "Inquiry already exists");
        require(
            product.productId >= 0 && product.productId < products.length,
            "Invalid Product Id"
        );
        require(
            product.quoteId >= 0 &&
                product.quoteId < productQuotes[product.productId].length,
            "Invalid Quote Id"
        );

        PolicyInquiry memory policyInquiry = PolicyInquiry({
            basicDetails: _basicDetails,
            docs: _docs,
            productId: product.productId,
            quoteId: product.quoteId,
            hasApproved: false,
            status: PolicyStatus.Pending,
            nominee: _nominee,
            relationship: _relationship,
            premiumPaid: 0,
            premium: productQuotes[product.productId][product.quoteId].premium,
            sumAssured: productQuotes[product.productId][product.quoteId]
                .sumAssured
            // start: block.timestamp,
            // expiry: block.timestamp + 365 days
        });

        registerInquiry(msg.sender, _nominee, policyInquiry);
    }

    function registerInquiry(
        address _owner,
        address nominee,
        PolicyInquiry memory policyInquiry
    ) internal returns (uint256) {
        policyInquiries[_owner] = policyInquiry;
        policyInquiriesByNominee[nominee] = policyInquiry;

        exists[_owner] = true;
        nomineeExists[nominee] = true;
        listOfInquiries.push(policyInquiry);
        policyExpiry[listOfInquiries.length - 1].start = block.timestamp;
        policyExpiry[listOfInquiries.length - 1].expiry =
            block.timestamp +
            365 days;
        return listOfInquiries.length - 1;
    }

    // Function to update sumAssured and premium
    function updateSumAssuredAndPremium(
        uint256 _newSumAssured,
        uint256 _newPremium
    ) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].sumAssured = _newSumAssured;
        policyInquiries[msg.sender].premium = _newPremium;
    }

    // Function to update basic details
    function updateBasicDetails(string memory _basicDetails) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].basicDetails = _basicDetails;
    }

    // Function to update id proof
    function updateIdProof(string memory _newProof) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].docs.idProof = _newProof;
    }

    // Function to update age proof
    function updateAgeProof(string memory _newProof) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].docs.ageProof = _newProof;
    }

    // Function to update financial proof
    function updateFinancialProof(string memory _newProof) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].docs.financialProof = _newProof;
    }

    // Function to update address proof
    function updateAddressProof(string memory _newProof) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].docs.addressProof = _newProof;
    }

    // Function to update inquiry status
    function updateInquiryStatus(PolicyStatus status) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].status = status;
    }

    // Function to update product id
    function updateProductId(uint8 _newProductId) public {
        require(checkExists(msg.sender), "Inquiry does not exist.");

        policyInquiries[msg.sender].productId = _newProductId;
    }

    // Function to get policy details
    function getPolicyInquiry() public view returns (PolicyInquiry memory) {
        require(checkExists(msg.sender), "Inquiry does not exist.");
        return policyInquiries[msg.sender];
    }
}
