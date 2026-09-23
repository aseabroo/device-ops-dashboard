const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const [firmware] = await pool.execute(
      `SELECT firmware_id, version, released_on, size_mb, release_status
       FROM firmware_releases
       ORDER BY released_on DESC`
    );

    res.render('firmware', { title: 'Firmware', firmware });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
