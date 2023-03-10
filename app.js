const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { CodeError } = require('./statusCode');
const users = require('./routes/users');
const cards = require('./routes/cards');

const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = { _id: '6400cf0a2c6ea103619eac89' };
  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => res.status(CodeError.NOT_FOUND).send({ message: 'Страница не существует' }));

mongoose.set('runValidators', true);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Подключено к MongoDB');

  app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
});
