const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authmiddleware');

// ADD/UPDATE REVIEW (protected)
router.post('/', protect, async (req, res) => {
    const { product_id, rating, review } = req.body;
    const user_id = req.user.id;

    try {
        // Check if user already reviewed this product
        const [existing] = await db.query(
            'SELECT * FROM reviews WHERE product_id = ? AND user_id = ?',
            [product_id, user_id]
        );

        if (existing.length > 0) {
            // Update existing review
            await db.query(
                'UPDATE reviews SET rating = ?, review = ? WHERE product_id = ? AND user_id = ?',
                [rating, review, product_id, user_id]
            );
        } else {
            // Insert new review
            await db.query(
                'INSERT INTO reviews (product_id, user_id, rating, review) VALUES (?, ?, ?, ?)',
                [product_id, user_id, rating, review]
            );
        }

        // Recalculate avg rating and count
        const [result] = await db.query(
            'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?',
            [product_id]
        );

        const avg = parseFloat(result[0].avg).toFixed(1);
        const count = result[0].count;

        await db.query(
            'UPDATE products SET avg_rating = ?, review_count = ? WHERE id = ?',
            [avg, count, product_id]
        );

        res.json({ alert: 'Review submitted!', avg_rating: avg, review_count: count });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET reviews for a product (public)
router.get('/:product_id', async (req, res) => {
    try {
        const [reviews] = await db.query(
            `SELECT r.rating, r.review, r.created_at, u.name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? 
             ORDER BY r.created_at DESC`,
            [req.params.product_id]
        );

        const [stats] = await db.query(
            'SELECT avg_rating, review_count FROM products WHERE id = ?',
            [req.params.product_id]
        );

        res.json({ reviews, stats: stats[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;