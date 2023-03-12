require("dotenv").config();
const { Alchemy, Network } = require("alchemy-sdk");
Web3 = require("web3");
const alchemyKey = process.env.ALCHEMY_API_KEY;

async function getTransaction(request, response) {
  let data;

  try {
    const config = {
      apiKey: alchemyKey,
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);
    const { address } = request.body;
    const incomingTransactions = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      toAddress: address,
      category: ["external", "internal", "erc20", "erc721"],
    });
    const outgoingTransactions = await alchemy.core.getAssetTransfers({
      fromBlock: "0x0",
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721"],
    });

    if (incomingTransactions?.transfers) {
      const newData = incomingTransactions?.transfers.concat(
        outgoingTransactions?.transfers
      );
      data = newData?.map((tx) => ({
        ...tx,
        type: tx.to === address ? "IN" : "OUT",
      }));
      data = newData;
    }
    response.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      error: error,
    });
  }
}

module.exports = {
  getTransaction,
};
