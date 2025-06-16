const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let lastModifiedTime = null;

function getFileStats(filePath) {
  return fs.promises.stat(filePath);
}

async function getStats() {
  try {
    const stats = await getFileStats(DATA_PATH);

    const fileModifiedTime = stats.mtimeMs;

    if (fileModifiedTime === lastModifiedTime && cachedStats) {
      return cachedStats;
    }

    const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
    const items = JSON.parse(raw);

    cachedStats = {
      total: items.length,
      averagePrice:
        items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
      lastUpdated: new Date(),
    };

    lastModifiedTime = fileModifiedTime;

    return cachedStats;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get stats', err.message);
  }
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
