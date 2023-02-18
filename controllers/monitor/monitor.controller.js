require("dotenv").config();
Web3 = require("web3");

function monitorAddress(address) {
  const subscription = web3.eth.subscribe(
    "logs",
    {
      address: address,
    },
    (error, result) => {
      if (!error) {
        // Check if the address bought or sold
        const topics = result.topics;
        const isBuy =
          topics[0] ===
          "0xa3b6e37fa84c9d9a228f6c539cac6a61224c288fc31ec45d92f4968288e5b528";
        const isSell =
          topics[0] ===
          "0x77a7a2ae00eb8cc47dcaf6d3740a06f31cc54630e86eeed2a0f3c7b3a119b8dd";
        if (isBuy || isSell) {
          console.log(
            `Address ${address} ${isBuy ? "bought" : "sold"} at block ${
              result.blockNumber
            }`
          );
        }
      } else {
        console.error(error);
      }
    }
  );

  // Unsubscribe when the process exits
  process.on("SIGINT", () => {
    subscription.unsubscribe((error, success) => {
      if (success) {
        console.log("Unsubscribed from address events");
        process.exit(0);
      } else {
        console.error(error);
        process.exit(1);
      }
    });
  });
}

module.exports = {
  monitorAddress,
};
