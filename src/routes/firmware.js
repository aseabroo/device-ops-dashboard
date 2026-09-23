const express = require('express');
const pool = require('../config/database');
const { nonEmpty } = require('../utils/validation');

const router = express.Router();
const RELEASE_STATUSES = new Set(['planned', 'active', 'deprecated']);

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

router.post('/', async (req, res, next) => {
  try {
    const version = String(req.body.version || '').trim();
    const releasedOn = req.body.released_on || null;
    const sizeMb = Number(req.body.size_mb);
    const releaseStatus = String(req.body.release_status || 'planned');

    if (!nonEmpty(version) || !releasedOn || !Number.isFinite(sizeMb) || sizeMb < 0 || !RELEASE_STATUSES.has(releaseStatus)) {
      return res.status(400).send('Invalid firmware release.');
    }

    await pool.execute(
      `INSERT INTO firmware_releases (version, released_on, size_mb, release_status)
       VALUES (?, ?, ?, ?)`,
      [version, releasedOn, sizeMb, releaseStatus]
    );

    res.redirect('/firmware');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/update', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const sizeMb = Number(req.body.size_mb);
    const releaseStatus = String(req.body.release_status || '');

    if (!Number.isInteger(id) || !Number.isFinite(sizeMb) || sizeMb < 0 || !RELEASE_STATUSES.has(releaseStatus)) {
      return res.status(400).send('Invalid firmware update.');
    }

    await pool.execute(
      `UPDATE firmware_releases
       SET size_mb = ?, release_status = ?
       WHERE firmware_id = ?`,
      [sizeMb, releaseStatus, id]
    );

    res.redirect('/firmware');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).send('Invalid firmware id.');
    }

    await pool.execute('DELETE FROM firmware_releases WHERE firmware_id = ?', [id]);
    res.redirect('/firmware');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
