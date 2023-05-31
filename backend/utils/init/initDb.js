const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const DBClient = require('../db');

const dbEndpoint = process.env.COSMOS_DB_ENDPOINT;
const dbKey = process.env.COSMOS_DB_KEY;
const dbName = process.env.COSMOS_DB_DATABASE_NAME;

const db = new DBClient(dbEndpoint, dbKey);

db
  .createDb(dbName)
  .then(() => db.createContainer('db', ['/id']))
  .then()
  .catch(err => {
    console.log('DB initialization failure: ' + err.message);
    process.exit(1);
  });

module.exports = db;