const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authmiddleware');

// PLACE ORDER (protected)
router.post('/', protect, async (req, res) => {
  const { items } = req.body; // items = [{ product_id, quantity }]
  const user_id = req.user.id;

  try {
    // Calculate total
    let total = 0;
    for (const item of items) {
      const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      if (product.length === 0) {
        return res.status(404).json({ message: `Product ${item.product_id} not found` });
      }
      total += product[0].price * item.quantity;
    }

    // Create order
    const [order] = await db.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [user_id, total]
    );

    const order_id = order.insertId;

    // Save order items
    for (const item of items) {
      const [product] = await db.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, product[0].price]
      );
    }

    res.status(201).json({ message: 'Order placed successfully', order_id, total });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all orders for logged in user (protected)
router.get('/myorders', protect, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single order details (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: order[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// CANCEL ORDER (protected)
router.put('/cancel/:id', protect, async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order[0].user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order[0].status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel a delivered order' });
    }

    await db.query('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', req.params.id]);

    res.json({ message: 'Order cancelled successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});