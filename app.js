/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { CodeError } = require('./statusCode');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => res.status(CodeError.NOT_FOUND).send({ message: 'Страница не существует' }));

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).send({ message: err.message });
});

mongoose.set('runValidators', true);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}, () => {
  console.log('Подключено к MongoDB');

  app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
});
