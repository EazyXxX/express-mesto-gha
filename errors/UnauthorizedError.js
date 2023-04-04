class UnauthorizedError extends Error {
  constructor(message = 'Необходима авторизация') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
