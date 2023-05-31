const DBClient = require('../../utils/db');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

test();

async function test() {
  const ENDPOINT = process.env.COSMOS_DB_ENDPOINT;
  const KEY = process.env.COSMOS_DB_KEY;
  const DATABASE_NAME = process.env.COSMOS_DB_DATABASE_NAME;

  if (!ENDPOINT || !KEY || !DATABASE_NAME) {
    console.log('❌ Database Test failed: Missing environment variables.');
    process.exit(1);
  }

  let dbClient, db, container;
  try {
    dbClient = new DBClient(ENDPOINT, KEY);
    await dbClient.createDb(DATABASE_NAME);
    await dbClient.createContainer('testdb', ['/id']);
  } catch(err) {
    console.log('❌ Database Test failed: ' + err.message);
    process.exit(1);
  }



  const items = [
    { id: 'first group', name: 'test0' },
    { id: 'second group', name: 'test1' },
    { id: 'third group', name: 'test2' }
  ];

  for (let item of items) {
    try {
      await dbClient.createItem(item);
    } catch(err) {
      console.log('❌ Database Test failed: Failed to create item. ' + err.message);
      process.exit(1);
    }    
  }

  for (let item of items) {
    const readItem = await dbClient.readItem(item.id);
    if (readItem.id !== item.id || readItem.name !== item.name) {
      console.log('❌ Database Test failed: Read item does not match created item.');
      process.exit(1);
    }
  }

  for (let item of items) {
    const randInt = Math.floor(Math.random() * 100);
    item.age = randInt;
    await dbClient.updateItem(item.id, item);
    
    const readItem = await dbClient.readItem(item.id);
    if (readItem.id !== item.id || readItem.name !== item.name || readItem.age !== randInt) {
      console.log('❌ Database Test failed: Read item does not match created item.');
      process.exit(1);
    }
  }


  for (let item of items) {
    const deleteItem = await dbClient.deleteItem(item.id);
    if (!deleteItem) {
      console.log('❌ Database Test failed: Failed to delete item.');
      process.exit(1);
    }
  }

  for (let item of items) {
    const readItem = await dbClient.readItem(item.id);
    if (readItem) {
      console.log('❌ Database Test failed: Failed to delete item.');
      process.exit(1);
    }
  }

  console.log('✅ Database module tests passed');
}