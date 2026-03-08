const express = require('express');
const router = express.Router();
const db = require('../config/db');
const protect = require('../middleware/authMiddleware');

// SAVE ADDRESS (protected)
router.post('/', protect, async (req, res) => {
  const { full_name, street, apt, city, state, zip, phone } = req.body;
  const user_id = req.user.id;

  try {
    // Set all existing addresses to non-default
    await db.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [user_id]);

    // Save new address as default
    await db.query(
      'INSERT INTO addresses (user_id, full_name, street, apt, city, state, zip, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
      [user_id, full_name, street, apt || null, city, state, zip, phone]
    );

    res.status(201).json({ message: 'Address saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET addresses for logged in user (protected)
router.get('/', protect, async (req, res) => {
  try {
    const [addresses] = await db.query(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC',
      [req.user.id]
    );
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE address (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    await db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', 
      [req.params.id, req.user.id]);
    res.json({ message: 'Address deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;