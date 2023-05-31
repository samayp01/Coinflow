const Cache = require('../../utils/cache');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

test();

async function test() {
  const cacheHost = process.env.AZURE_REDIS_HOST_NAME;
  const cacheKey = process.env.AZURE_REDIS_ACCESS_KEY;
  const cachePort = process.env.AZURE_REDIS_PORT;

  if (!cacheHost || !cacheKey || !cachePort) {
    console.log('❌ Cache Test failed: Missing cache host, key, or port.');
    process.exit(1);
  }

  const cache = new Cache(cacheHost, cacheKey, cachePort);
  if (!cache) {
    console.log('❌ Cache Test failed: Cache not initialized.');
    process.exit(1);
  }

  try {
    await cache.connect();
  } catch(err) {
    console.log('❌ Cache Test failed: ' + err.message);
    process.exit(1);
  }

  if (await cache.ping() !== 'PONG') {
    console.log('❌ Cache Test failed: Ping failed.');
    process.exit(1);
  }

  if (await cache.get('test') !== null) {
    console.log('❌ Cache Test failed: Get failed.');
    process.exit(1);
  }

  try {
    await cache.set('test', 'test');
  } catch(err) {
    console.log('❌ Cache Test failed: Set failed.');
    process.exit(1);
  }

  if (await cache.get('test') !== 'test') {
    console.log('❌ Cache Test failed: Get failed.');
    process.exit(1);
  }

  try {
    await cache.del('test');
  } catch(err) {
    console.log('❌ Cache Test failed: Del failed.');
    process.exit(1);
  }

  if (await cache.get('test') !== null) {
    console.log('❌ Cache Test failed: Get failed.');
    process.exit(1);
  }

  try {
    await cache.disconnect();
  } catch(err) {
    console.log('❌ Cache Test failed: Disconnect failed.');
    process.exit(1);
  }

  console.log('✅ Cache module tests passed');
}