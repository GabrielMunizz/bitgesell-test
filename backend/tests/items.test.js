jest.mock('../src/elastic/client');
const request = require('supertest');
const express = require('express');
const fs = require('fs');
const itemsRouter = require('../src/routes/items');
const mockItems = require('./__mocks__/mockItems');
const client = require('../src/elastic/client');
const app = express();

app.use(express.json());
app.use('/api/items', itemsRouter);

beforeEach(() => {
  // makes sure tests runs without API or Elasticsearch dependency
  client.search.mockRejectedValue(new Error('Elasticsearch is down'));
  jest
    .spyOn(fs.promises, 'readFile')
    .mockResolvedValue(JSON.stringify(mockItems));
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GET /api/items', () => {
  it('should return a list of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(mockItems.length);
  });

  it('should return filtered items when using query', async () => {
    const res = await request(app).get('/api/items?q=Noise');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: expect.stringMatching(/noise/i) }),
      ])
    );
  });

  it('should return status 404 and error', async () => {
    const res = await request(app).get('/api/items?q=test');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.stringMatching(/Item not found!/i),
      })
    );
  });
});

describe('POST /api/items', () => {
  it('should create a new item', async () => {
    const newItem = { name: 'New Gadget', price: 19.99 };
    const res = await request(app).post('/api/items').send(newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.price).toBe(newItem.price);
  });

  it('should return error when payload is invalid', async () => {
    const res = await request(app).post('/api/items').send({});

    expect(res.statusCode).toBe(400);
  });
});
