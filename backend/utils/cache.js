/**
 * Redis cache client module
 */

const redis = require('redis');
const RECONNECT_TIMEOUT = 1000;

class Cache {
  constructor(HOST_NAME, CACHE_ACCESS_KEY, CACHE_PORT) {
    this.client = null;
    this.client = initializeCacheClient(HOST_NAME, CACHE_ACCESS_KEY, CACHE_PORT);
  }

  async connect() {
    return this.client.connect();
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value) {
    return this.client.set(key, value);
  }

  async del(key) {
    return this.client.del(key);
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async ping() {
    return this.client.ping();
  }
}

function initializeCacheClient(HOST_NAME, CACHE_ACCESS_KEY, CACHE_PORT) {
  let client = redis.createClient({
    url: `rediss://${HOST_NAME}:${CACHE_PORT}`,
    password: CACHE_ACCESS_KEY
  });

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', (err) => {
    console.log('Redis client error. Attempting to reconnect...');
    setTimeout(() => {
      return initializeCacheClient(HOST_NAME, CACHE_ACCESS_KEY, CACHE_PORT);
    }, RECONNECT_TIMEOUT);
  });

  return client;
}

module.exports = Cache;