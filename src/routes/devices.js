const express = require('express');
const pool = require('../config/database');
const { nonEmpty, validDeviceStatus } = require('../utils/validation');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [devices] = await pool.execute(
      `SELECT d.device_id, d.serial_number, d.model, d.purchased_on, d.status,
              d.customer_id, c.name AS customer_name
       FROM devices d
       JOIN customers c ON c.customer_id = d.customer_id
       ORDER BY d.device_id`
    );

    const [customers] = await pool.execute(
      'SELECT customer_id, name FROM customers ORDER BY name'
    );

    res.render('devices', { title: 'Devices', devices, customers });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const customerId = Number(req.body.customer_id);
    const serialNumber = String(req.body.serial_number || '').trim();
    const model = String(req.body.model || '').trim();
    const purchasedOn = req.body.purchased_on || null;
    const status = String(req.body.status || 'active');

    if (!Number.isInteger(customerId) || !nonEmpty(serialNumber) || !nonEmpty(model) || !validDeviceStatus(status)) {
      return res.status(400).send('Invalid device data.');
    }

    await pool.execute(
      `INSERT INTO devices (customer_id, serial_number, model, purchased_on, status)
       VALUES (?, ?, ?, ?, ?)`,
      [customerId, serialNumber, model, purchasedOn || null, status]
    );

    res.redirect('/devices');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/update', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const model = String(req.body.model || '').trim();
    const purchasedOn = req.body.purchased_on || null;
    const status = String(req.body.status || '');

    if (!Number.isInteger(id) || !nonEmpty(model) || !validDeviceStatus(status)) {
      return res.status(400).send('Invalid device update.');
    }

    await pool.execute(
      `UPDATE devices
       SET model = ?, purchased_on = ?, status = ?
       WHERE device_id = ?`,
      [model, purchasedOn || null, status, id]
    );

    res.redirect('/devices');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).send('Invalid device id.');
    }

    await pool.execute('DELETE FROM devices WHERE device_id = ?', [id]);
    res.redirect('/devices');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
