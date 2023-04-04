class ConflictError extends Error {
  constructor(message = 'Доступ к запрошенному ресурсу запрещён') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ConflictError;
