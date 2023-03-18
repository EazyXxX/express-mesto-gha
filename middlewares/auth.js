/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = await jwt.verify(token, '1hf8r041jf5f2hf7j0fbv6zx2');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};

module.exports = authMiddleware;
