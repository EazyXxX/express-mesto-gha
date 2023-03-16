class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Пользователь не найден';
  }
}

module.exports = UnauthorizedError;
