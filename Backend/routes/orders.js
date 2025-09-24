const express = require('express');
const router = express.Router();
const db = require('../db');

// Place an order
router.post('/', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
    // Default 30-minute delivery promise
    const delivery_time = "Within 30 minutes";

    const [result] = await db.query(
      'INSERT INTO orders (user_id, product_id, quantity, delivery_time) VALUES (?, ?, ?, ?)',
      [user_id, product_id, quantity, delivery_time]
    );
    res.json({ message: 'Order placed successfully', orderId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders for a user
router.get('/:user_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT o.id, p.name, o.quantity, o.delivery_time, o.created_at FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = ?',
      [req.params.user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
