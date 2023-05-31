const { decodeToken } = require('../../utils/auth');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const AUTH_API_SECRET = process.env.AUTH_API_SECRET;

const authorize = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (decodeToken(token, AUTH_API_SECRET)) {
      next();
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
};

module.exports = authorize;