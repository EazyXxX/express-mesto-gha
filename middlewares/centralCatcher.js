const ServerError = require('../errors/ServerError');

const centralCatcher = (err, req, res) => {
  if (err.statusCode === 500) {
    console.log(err.message);
    res.status(ServerError.statusCode).send({ message: ServerError.message });
  } else {
    res.send(err.message);
  }
};

module.exports = centralCatcher;
