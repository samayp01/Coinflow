const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const Email = require('../email');

const emailConnectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;

const email = new Email(emailConnectionString);

module.exports = email;