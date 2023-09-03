const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

router.post('/response', async (req, res) => {
  try {
    const input = req.body;

    const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const saltIndex = 1;

    const finalXHeader =
      crypto
        .createHash('sha256')
        .update(
          `/pg/v1/status/${input.merchantId}/${input.transactionId}${saltKey}`
        )
        .digest('hex') + '###' + saltIndex;

    const response = await axios.get(
      `https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/${input.merchantId}/${input.transactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          'X-VERIFY': finalXHeader,
          'X-MERCHANT-ID': input.transactionId,
        },
      }
    );

    console.log(response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

module.exports = router;
