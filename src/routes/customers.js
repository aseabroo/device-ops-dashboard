const express = require('express');
const pool = require('../config/database');
const { nonEmpty, validEmail } = require('../utils/validation');

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

    if (!nonEmpty(name) || !validEmail(email)) {
      return res.status(400).send('Valid name and email are required.');
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

router.post('/:id/update', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim();

    if (!Number.isInteger(id) || !nonEmpty(name) || !validEmail(email)) {
      return res.status(400).send('Invalid customer update.');
    }

    await pool.execute(
      'UPDATE customers SET name = ?, email = ? WHERE customer_id = ?',
      [name, email, id]
    );

    res.redirect('/customers');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).send('Invalid customer id.');
    }

    await pool.execute('DELETE FROM customers WHERE customer_id = ?', [id]);
    res.redirect('/customers');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
