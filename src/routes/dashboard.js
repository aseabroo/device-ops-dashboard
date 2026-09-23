const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [[customers]] = await pool.execute('SELECT COUNT(*) AS count FROM customers');
    const [[devices]] = await pool.execute('SELECT COUNT(*) AS count FROM devices');
    const [[firmware]] = await pool.execute('SELECT COUNT(*) AS count FROM firmware_releases');
    const [[openTickets]] = await pool.execute(
      "SELECT COUNT(*) AS count FROM service_tickets WHERE status <> 'resolved'"
    );
    const [[deployments]] = await pool.execute('SELECT COUNT(*) AS count FROM device_firmware');

    res.render('dashboard', {
      title: 'Dashboard',
      metrics: {
        customers: customers.count,
        devices: devices.count,
        firmware: firmware.count,
        openTickets: openTickets.count,
        deployments: deployments.count
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
