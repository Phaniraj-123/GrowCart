const express = require('express');
const router = express.Router();
const db = require('../config/db');
const adminAuth = require('../middleware/adminmiddleware');

// Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [[totalOrders]] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [[revenue]] = await db.query('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"');
        const [[totalUsers]] = await db.query('SELECT COUNT(*) as count FROM users WHERE is_admin = 0');
        const [[totalProducts]] = await db.query('SELECT COUNT(*) as count FROM products');
        const [recentOrders] = await db.query(`
            SELECT o.id, o.total, o.status, o.created_at, u.name 
            FROM orders o JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 5
        `);

        res.json({ totalOrders: totalOrders.count, revenue: revenue.total || 0, totalUsers: totalUsers.count, totalProducts: totalProducts.count, recentOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add product
router.post('/products', adminAuth, async (req, res) => {
    const { name, description, price, stock, image_url, category } = req.body;
    try {
        await db.query(
            'INSERT INTO products (name, description, price, stock, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, image_url, category]
        );
        res.json({ message: 'Product added!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit product
router.put('/products/:id', adminAuth, async (req, res) => {
    const { name, description, price, stock, image_url, category } = req.body;
    try {
        await db.query(
            'UPDATE products SET name=?, description=?, price=?, stock=?, image_url=?, category=? WHERE id=?',
            [name, description, price, stock, image_url, category, req.params.id]
        );
        res.json({ message: 'Product updated!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
    try {
       const [orders] = await db.query(`
    SELECT o.id, o.total, o.status, o.created_at, u.name, u.email, u.mobile,
           a.full_name, a.street, a.city, a.state, a.zip, a.phone
    FROM orders o 
    JOIN users u ON o.user_id = u.id 
    LEFT JOIN addresses a ON o.user_id = a.user_id
    ORDER BY o.created_at DESC
`);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id', adminAuth, async (req, res) => {
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, mobile, created_at, is_admin FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;