class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = 'Произошла ошибка на стороне сервера';
  }
}

module.exports = ServerError;
