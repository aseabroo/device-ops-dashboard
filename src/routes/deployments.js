const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [deployments] = await pool.execute(
      `SELECT df.device_id, df.firmware_id, df.installed_at,
              d.serial_number, d.model,
              f.version
       FROM device_firmware df
       JOIN devices d ON d.device_id = df.device_id
       JOIN firmware_releases f ON f.firmware_id = df.firmware_id
       ORDER BY df.installed_at DESC`
    );

    const [devices] = await pool.execute(
      'SELECT device_id, serial_number, model FROM devices ORDER BY serial_number'
    );

    const [firmware] = await pool.execute(
      'SELECT firmware_id, version FROM firmware_releases ORDER BY released_on DESC'
    );

    res.render('deployments', { title: 'Deployments', deployments, devices, firmware });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const deviceId = Number(req.body.device_id);
    const firmwareId = Number(req.body.firmware_id);

    if (!Number.isInteger(deviceId) || !Number.isInteger(firmwareId)) {
      return res.status(400).send('Invalid deployment.');
    }

    await pool.execute(
      `INSERT INTO device_firmware (device_id, firmware_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE installed_at = CURRENT_TIMESTAMP`,
      [deviceId, firmwareId]
    );

    res.redirect('/deployments');
  } catch (error) {
    next(error);
  }
});

router.post('/delete', async (req, res, next) => {
  try {
    const deviceId = Number(req.body.device_id);
    const firmwareId = Number(req.body.firmware_id);

    if (!Number.isInteger(deviceId) || !Number.isInteger(firmwareId)) {
      return res.status(400).send('Invalid deployment.');
    }

    await pool.execute(
      'DELETE FROM device_firmware WHERE device_id = ? AND firmware_id = ?',
      [deviceId, firmwareId]
    );

    res.redirect('/deployments');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
