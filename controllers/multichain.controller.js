async function getBalanceAcrossChains(request, response) {
  try {
    const { address } = request.body;
    const res = await axios.get(
      `https://dashboard.alchemyapi.io/api/multichain-balances/${address}?key=${alchemyKey}`
    );
    console.log(res);
    response.status(200).json({
      data: response,
    });
  } catch (error) {
    response.status(500).json({
      error: error,
    });
  }
}
