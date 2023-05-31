/**
 * Authentication Module
 */

const jwt = require('jsonwebtoken');

const VERIFICATION_CODE_LEN = 6;
const JWT_HASH_ALGO = 'HS256';
const EXPIRATION = '14d';

// Generate a random verification code
function generateVerificationCode() {
  const randInt = Math.floor(Math.random() * (10 ** VERIFICATION_CODE_LEN));
  return randInt.toString().padStart(VERIFICATION_CODE_LEN, '0');
}

// Constructs a JWT token from a data object
function constructToken(data, API_SECRET_KEY) {
  return jwt.sign({ data }, API_SECRET_KEY, { 
    algorithm: JWT_HASH_ALGO,
    expiresIn: EXPIRATION
  });
}

// Decodes a JWT token
function decodeToken(token, API_SECRET_KEY) {
  try {
    return jwt.verify(token, API_SECRET_KEY);
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateVerificationCode,
  constructToken,
  decodeToken
}