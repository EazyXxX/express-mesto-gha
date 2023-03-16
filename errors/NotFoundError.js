class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = 'Данные не найдены';
  }
}

module.exports = NotFoundError;
