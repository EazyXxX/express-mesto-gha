const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Данного пользователя не существует');
    }
  } catch (err) {
    next(err);
  }

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = await jwt.verify(token, '1hf8r041jf5f2hf7j0fbv6zx2');
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
