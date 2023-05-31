/**
 * Cosmos DB client class
 */

const { CosmosClient } = require('@azure/cosmos');

class Db {
  constructor(ENDPOINT, KEY, DATABASE_NAME) {
    this.client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
  }

  async createDb(dbName) {
    const { database } = await this.client.databases.createIfNotExists({ 
      id: dbName 
    });
    this.db = database;
    return database;
  }

  async createContainer(containerName, partitionKeyPath) {
    if (!this.db) throw new Error('Database not initialized.');
    const { container } = await this.db.containers.createIfNotExists({ 
      id: containerName, 
      partitionKey: {
        paths: partitionKeyPath
      } 
    });

    this.container = container;
    return container;
  }

  async createItem(item) {
    if (!this.container) throw new Error('Container not initialized.');
    const { resource } = await this.container.items.create(item);
    return resource;
  }

  async readItem(key) {
    if (!this.container) throw new Error('Container not initialized.');
    const { resource } = await this.container.item(key, key).read();
    return resource;
  }

  async deleteItem(key) {
    if (!this.container) throw new Error('Container not initialized.');
    const { statusCode } = await this.container.item(key, key).delete();
    return statusCode === 204;
  }

  async updateItem(key, item) {
    if (!this.container) throw new Error('Container not initialized.');
    const { resource } = await this.container.item(key, key).replace(item);
    return resource;
  }
}

module.exports = Db;