const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authMiddleware = (err, req, res, next) => {
  const { authorization } = req.headers;
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500
    ? `На сервере произошла ошибка: ${err.message}`
    : err.message;

  res.status(statusCode).send({ message });

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  // попытаемся верифицировать токен
  jwt.verify(token, JWT_SECRET)
    .catch((e) => {
      next(e);
    });
  req.user = payload;
  next();
};

module.exports = authMiddleware;
