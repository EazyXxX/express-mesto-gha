/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { CodeError } = require('./statusCode');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

mongoose.set('strictQuery', false);

const app = express();

const PORT = 3000;

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
