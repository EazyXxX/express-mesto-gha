class ServerError extends Error {
  constructor(message = 'Произошла ошибка на стороне сервера') {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = ServerError;
