class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = 'Переданы некорректные данные';
  }
}

module.exports = BadRequestError;
