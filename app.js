/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');

const mongoose = require('mongoose');

const path = require('path');

const bodyParser = require('body-parser');

const app = express();

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6400cf0a2c6ea103619eac89',
  };

  next();
});

app.use('*', (req, res) => res.status(CodeError.NOT_FOUND).send({ message: 'Страница не существует.' }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.set('runValidators', true);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`App listening on port ${PORT}`);
});
