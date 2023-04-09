const centralCatcher = (err, req, res) => {
  if (err.statusCode === 500) {
    console.log(err.message);
    res.status(err.statusCode).send({ message: err.message });
  } else {
    if (err.statusCode !== true) {
      console.log(err);
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    }
    console.log(err);
    res.status(500).send(err.message);
  }
};

module.exports = centralCatcher;
