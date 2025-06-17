const fs = require('fs');
const client = require('../backend/src/elastic/client');
const path = require('path');
const dataPath = path.join(__dirname, '../data/items.json');

const items = JSON.parse(fs.readFileSync(dataPath));

// Index into Elasticsearch
async function indexData() {
  for (const item of items) {
    await client.index({
      index: 'items',
      id: item.id.toString(),
      document: item,
    });
  }

  //Refresh index for immediate availability
  await client.indices.refresh({ index: 'items' });

  console.log('Indexation complete!');
}

indexData();
