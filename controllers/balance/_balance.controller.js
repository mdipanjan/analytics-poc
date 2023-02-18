const axios = require("axios");

require("dotenv").config();
Web3 = require("web3");
const alchemyProvider = process.env.ALCHEMY_HTTPS_PROVIDER;
const alchemyKey = process.env.ALCHEMY_API_KEY;
const ERC20_ABI = require("erc-20-abi");

async function _getErc20Balance(request, response) {
  try {
    const { address } = request.body;
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`${alchemyProvider}`)
    );
    const balances = {};
    //GET: Eth balance
    const ethBalance = await web3.eth.getBalance(address);
    balances["ETH"] = web3.utils.fromWei(ethBalance, "ether");
    // GET: token balances
    const tokenContracts = await getERC20ContractsOnChain(web3, 1);
    for (const contract of tokenContracts) {
      const token = web3.eth.Contract(ERC20_ABI, contract.address);
      const tokenSymbol = await token.methods.symbol().call();
      const tokenDecimals = await token.methods.decimals().call();
      const tokenBalance = await token.methods.balanceOf(address).call();
      balances[tokenSymbol] = tokenBalance / 10 ** tokenDecimals;
    }
    response.status(200).json({
      data: balances,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: error,
    });
  }
}
async function getERC20ContractsOnChain(web3, chainId) {
  try {
    // const chainUrl = getChainUrl(chainId); // Helper function to get chain endpoint URL
    const chainName = getChainName(chainId); // Helper function to get chain name
    console.log(`Getting ERC-20 contracts on ${chainName}...`);
    const blockNumber = await web3.eth.getBlockNumber();
    const allContracts = await web3.eth.getPastLogs({
      fromBlock: blockNumber - 10,
      toBlock: blockNumber,
      topics: [null, null, null, null],
      address: null,
    });

    const tokenContracts = [];
    for (const contract of allContracts) {
      const contractAddress = contract.address.toLowerCase();
      const code = await web3.eth.getCode(contractAddress);
      if (code.length > 2 && code.slice(0, 2) !== "0x") {
        // Contract has code and is not a proxy contract
        const contractInstance = new web3.eth.Contract(
          ERC20_ABI,
          contractAddress
        );
        if (await isERC20Contract(contractInstance)) {
          tokenContracts.push({ address: contractAddress });
        }
      }
    }

    console.log(
      `Found ${tokenContracts.length} ERC-20 contracts on ${chainName}.`
    );
    return tokenContracts;
  } catch (error) {
    console.log(error);
  }
}
async function isERC20Contract(contractInstance) {
  try {
    const totalSupply = await contractInstance.methods.totalSupply().call();
    const balance = await contractInstance.methods
      .balanceOf(contractInstance.options.address)
      .call();
    await contractInstance.methods
      .transfer("0x0000000000000000000000000000000000000001", 1)
      .send({ from: contractInstance.options.address, gas: 100000 });
    return true;
  } catch (error) {
    return false;
  }
}
function getChainName(chainId) {
  switch (chainId) {
    case 1:
      return "Mainnet";
    case 3:
      return "Ropsten";
    case 4:
      return "Rinkeby";
    case 5:
      return "Goerli";
    case 42:
      return "Kovan";
    default:
      return "Unknown network";
  }
}

module.exports = {
  _getErc20Balance,
};
