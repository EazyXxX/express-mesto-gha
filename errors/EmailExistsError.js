class EmailExistsError extends Error {
  constructor(message = 'Пользователь с такими данными уже существует') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = EmailExistsError;
