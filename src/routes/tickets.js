const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [tickets] = await pool.execute(
      `SELECT t.ticket_id, t.summary, t.status, t.reported_at,
              c.name AS customer_name,
              d.serial_number
       FROM service_tickets t
       JOIN customers c ON c.customer_id = t.customer_id
       LEFT JOIN devices d ON d.device_id = t.device_id
       ORDER BY t.reported_at DESC`
    );

    res.render('tickets', { title: 'Service Tickets', tickets });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || '');
    const allowed = new Set(['open', 'in_progress', 'resolved']);

    if (!Number.isInteger(id) || !allowed.has(status)) {
      return res.status(400).send('Invalid ticket update.');
    }

    await pool.execute(
      'UPDATE service_tickets SET status = ? WHERE ticket_id = ?',
      [status, id]
    );

    res.redirect('/tickets');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
