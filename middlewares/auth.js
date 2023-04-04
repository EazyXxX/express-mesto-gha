/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const UnauthorizedErrorInstance = new UnauthorizedError();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res.status(UnauthorizedErrorInstance.statusCode).send({ message: UnauthorizedErrorInstance.message });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UnauthorizedErrorInstance.statusCode).send({ message: UnauthorizedErrorInstance.message });
  }
  req.user = payload;
  next();
};

module.exports = authMiddleware;
