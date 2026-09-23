const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [devices] = await pool.execute(
      `SELECT d.device_id, d.serial_number, d.model, d.purchased_on, d.status,
              c.name AS customer_name
       FROM devices d
       JOIN customers c ON c.customer_id = d.customer_id
       ORDER BY d.device_id`
    );

    res.render('devices', { title: 'Devices', devices });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/status', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const status = String(req.body.status || '');
    const allowed = new Set(['active', 'maintenance', 'retired']);

    if (!Number.isInteger(id) || !allowed.has(status)) {
      return res.status(400).send('Invalid device update.');
    }

    await pool.execute(
      'UPDATE devices SET status = ? WHERE device_id = ?',
      [status, id]
    );

    res.redirect('/devices');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
