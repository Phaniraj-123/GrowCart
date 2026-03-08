const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authmiddleware');

// MAKE PAYMENT (protected)
router.post('/', protect, async (req, res) => {
  const { order_id, method } = req.body;

  try {
    // Check if order exists
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to logged in user
    if (order[0].user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if already paid
    if (order[0].status === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Record payment
    await db.query(
      'INSERT INTO payments (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
      [order_id, order[0].total, method, 'success']
    );

    // Update order status to paid
   await db.query('UPDATE orders SET status = ? WHERE id = ?', ['processing', order_id]);
   
    res.json({ message: 'Payment successful', amount: order[0].total, method });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET payment details for an order (protected)
router.get('/:order_id', protect, async (req, res) => {
  try {
    const [payment] = await db.query(
      'SELECT * FROM payments WHERE order_id = ?',
      [req.params.order_id]
    );
    if (payment.length === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;