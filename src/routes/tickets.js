const express = require('express');
const pool = require('../config/database');
const { nonEmpty, validTicketStatus } = require('../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [tickets] = await pool.execute(
      `SELECT t.ticket_id, t.summary, t.status, t.reported_at,
              t.customer_id, t.device_id,
              c.name AS customer_name,
              d.serial_number
       FROM service_tickets t
       JOIN customers c ON c.customer_id = t.customer_id
       LEFT JOIN devices d ON d.device_id = t.device_id
       ORDER BY t.reported_at DESC`
    );

    const [customers] = await pool.execute(
      'SELECT customer_id, name FROM customers ORDER BY name'
    );

    const [devices] = await pool.execute(
      'SELECT device_id, serial_number, model FROM devices ORDER BY serial_number'
    );

    res.render('tickets', { title: 'Service Tickets', tickets, customers, devices });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const customerId = Number(req.body.customer_id);
    const deviceId = req.body.device_id ? Number(req.body.device_id) : null;
    const summary = String(req.body.summary || '').trim();

    if (!Number.isInteger(customerId) || (deviceId !== null && !Number.isInteger(deviceId)) || !nonEmpty(summary)) {
      return res.status(400).send('Invalid service ticket.');
    }

    await pool.execute(
      `INSERT INTO service_tickets (customer_id, device_id, summary)
       VALUES (?, ?, ?)`,
      [customerId, deviceId, summary]
    );

    res.redirect('/tickets');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/update', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || '');
    const summary = String(req.body.summary || '').trim();

    if (!Number.isInteger(id) || !validTicketStatus(status) || !nonEmpty(summary)) {
      return res.status(400).send('Invalid ticket update.');
    }

    await pool.execute(
      'UPDATE service_tickets SET summary = ?, status = ? WHERE ticket_id = ?',
      [summary, status, id]
    );

    res.redirect('/tickets');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).send('Invalid ticket id.');
    }

    await pool.execute('DELETE FROM service_tickets WHERE ticket_id = ?', [id]);
    res.redirect('/tickets');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
