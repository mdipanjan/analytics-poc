const axios = require("axios");
require("dotenv").config();
const { Alchemy, Network } = require("alchemy-sdk");
const Web3 = require("web3");
const alchemyProvider = process.env.ALCHEMY_HTTPS_PROVIDER;
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

async function getBalance(request, response) {
  try {
    // Creating an instance of the Provider
    const web3 = new Web3(
      new Web3.providers.HttpProvider(`${alchemyProvider}`)
    );
    // Querying the Blockchain using the Provider and Web3.js
    const { address } = request.body;
    const balance = await web3.eth.getBalance(address);
    response.status(200).json({
      data: web3.utils.fromWei(balance, "ether"),
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: error,
    });
  }
}

async function getERC20Balance(request, response) {
  try {
    // Get balance of token
    const { address } = request.body;

    // Get token balances
    const balances = await alchemy.core.getTokenBalances(address);

    const nonZeroBalances = balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });
    let i = 1;

    for (let token of nonZeroBalances) {
      let balance = token.tokenBalance;

      // Get metadata of token
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata.decimals);
      balance = balance.toFixed(2);

      // Print name, balance, and symbol of token
      console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
    }

    response.status(200).json({
      data: "Hello",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: error,
    });
  }
}

module.exports = {
  getBalance,
  getERC20Balance,
};
