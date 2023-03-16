const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(UnauthorizedError).send({ message: 'Данного пользователя не существует' });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = await jwt.verify(token, '1hf8r041jf5f2hf7j0fbv6zx2');
    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    res.status(UnauthorizedError).send({ message: 'Данного пользователя не существует' });
  }
};

module.exports = authMiddleware;
