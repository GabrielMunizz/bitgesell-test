const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const client = require('../elastic/client');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Reads an async file using fs.promises.readFile (non-blocking I/O)
async function readFileAsync(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Utility to read data
async function readData() {
  const raw = await readFileAsync(DATA_PATH);

  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  // Optimized search with Elasticsearch
  const { q, limit = 2, page = 1 } = req.query;

  const from = (page - 1) * limit;
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  try {
    const esQuery = q
      ? {
          query: {
            match: {
              name: {
                query: q,
                fuzziness: 'AUTO',
              },
            },
          },
        }
      : { query: { match_all: {} } };

    const { hits } = await client.search({
      index: 'items',
      from,
      size: parsedLimit,
      ...esQuery,
    });

    const results = hits.hits.map((hit) => hit._source);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Item not found!' });
    }

    res.json({
      results,
      total: hits.total.value,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (err) {
    // If error fallback to local search
    console.error('Elasticsearch failed, falling back to local data');
    try {
      const data = await readData();
      let results = data;

      const start = (parsedPage - 1) * parsedLimit;
      const end = start + parsedLimit;

      if (q) {
        results = results.filter((item) =>
          item.name.toLowerCase().includes(q.toLowerCase())
        );
      }

      const total = results.length;
      const paginatedResults = results.slice(start, end);

      if (paginatedResults.length === 0) {
        return res.status(404).json({ error: 'Item not found!' });
      }

      res.json({
        results: paginatedResults,
        total,
        page: parsedPage,
        limit: parsedLimit,
      });
    } catch (fallbackErr) {
      next(fallbackErr);
    }
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find((i) => i.id === parseInt(req.params.id));

    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // Basic type validation
    const { name, price } = req.body;

    if (typeof name !== 'string' || typeof price !== 'number') {
      return res.status(400).json({
        error: 'Invalid payload: name must be string and price must be number!',
      });
    }

    const item = {
      id: Date.now(),
      name,
      price,
    };

    const data = await readData();
    data.push(item);
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
