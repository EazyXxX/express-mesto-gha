class EmailExistsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = 'Пользователь с такими данными уже существует';
  }
}

module.exports = EmailExistsError;
