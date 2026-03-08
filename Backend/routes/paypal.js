const express = require('express');
const router = express.Router();
const protect = require('../middleware/authmiddleware');
require('dotenv').config();

const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// CREATE ORDER
router.post('/create-order', protect, async (req, res) => {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount
            }
        }]
    });

    try {
        const order = await client.execute(request);
        res.json({ orderID: order.result.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'PayPal order creation failed' });
    }
});

// CAPTURE ORDER (after customer pays)
router.post('/capture-order', protect, async (req, res) => {
    const { orderID } = req.body;

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
        const capture = await client.execute(request);
        res.json({ 
            status: capture.result.status,
            id: capture.result.id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'PayPal capture failed' });
    }
});

module.exports = router;