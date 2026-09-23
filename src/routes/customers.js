const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [customers] = await pool.execute(
      'SELECT customer_id, name, email, created_at FROM customers ORDER BY customer_id'
    );
    res.render('customers', { title: 'Customers', customers });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();

    if (!name || !email) {
      return res.status(400).send('Name and email are required.');
    }

    await pool.execute(
      'INSERT INTO customers (name, email) VALUES (?, ?)',
      [name, email]
    );

    res.redirect('/customers');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
