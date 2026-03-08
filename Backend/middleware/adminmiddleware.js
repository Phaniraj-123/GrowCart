const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
        
        if (!rows.length || !rows[0].is_admin) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.user = rows[0];
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};