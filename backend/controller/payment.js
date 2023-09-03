const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const axios = require('axios');
const CryptoJS = require('crypto-js');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post(
  "/process",
  catchAsyncErrors(async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
      metadata: {
        company: "Becodemy",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

router.post(
  '/initiate', // Change the route path as needed
  async (req, res) => {
    try {

      const data = req.body.base64Payload;
      console.log(data);

      const checksumValue = req.body.checksumValue;
      console.log(checksumValue);

      const options = {
        method: 'POST',
        url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksumValue,
        },
        data: {
          request: data// Use the payload from the frontend
        }
      };


      const response = await axios.request(options);
      console.log(response.data);
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  }
);

// router.post('/status', async (req, res) => {
//   try {
//     res.status(200).json({ message: 'Payment status received successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while processing payment status' });
//   }
// });

router.post('/status', async (req, res) => {
  try {
    const statuscode = req.body.code;
    console.log('Status :', statuscode);
    // checkTransactionStatus(statuscode);
    res.status(200).json({ message: 'Payment status received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing payment status' });
  }
});

router.post('/response', (req, res) => {
  try {
    const responseData = req.body;
    console.log('Received response data:', responseData);
    res.status(200).json({ message: 'Response data received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing response data' });
  }
});

router.post('/payment-status', async (req, res) => {
  try {
    // Process the payment status data received from PhonePe
    const paymentStatusData = req.body; // The data sent by PhonePe
    // You should validate and process the payment status data here
    console.log(paymentStatusData);

    // Respond to PhonePe with a success status
    res.status(200).json({ message: 'Payment status received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing payment status' });
  }
});


const generateChecksum = (payload) => {
  const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
  const saltIndex = 1;
  const concatenatedString = payload + "/pg/v1/pay" + saltKey;
  const sha256Hash = CryptoJS.SHA256(concatenatedString).toString();
  const checksumValue = sha256Hash + "###" + saltIndex;
}

const checkTransactionStatus = async (transactionId) => {
  try {
    const MERCHANT_ID = 'MERCHANTUAT';
    const finalXHeader = generateChecksum(`/pg/v1/status/${MERCHANT_ID}/${transactionId}`);

    const response = await axios.get(`https://api-preprod.phonepe.com/apis/merchant-simulator/pg/v1/status/${MERCHANT_ID}/${transactionId}`, {
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-VERIFY': finalXHeader,
        'X-MERCHANT-ID': transactionId
      }
    });

    console.log('Transaction Status:', response.data);
  } catch (error) {
    console.error(error);
  }
};


router.post(
  '/callback',
  (req, res) => {
    const callbackData = req.body; // Callback data sent by PhonePe
    // Process the callback data and update your UI as needed
    // ...
    console.log(callbackData);
    res.status(200).send('Callback processed');
  }
);

module.exports = router;
