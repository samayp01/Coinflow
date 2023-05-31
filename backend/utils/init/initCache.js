const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Cache = require('../cache');

const cacheHost = process.env.AZURE_REDIS_HOST_NAME;
const cacheKey = process.env.AZURE_REDIS_ACCESS_KEY;
const cachePort = process.env.AZURE_REDIS_PORT;

const cache = new Cache(cacheHost, cacheKey, cachePort);

cache.connect()
  .then()
  .catch(err => {
    console.log('Cache initialization failure: ' + err.message);
    process.exit(1);
  });

module.exports = cache;