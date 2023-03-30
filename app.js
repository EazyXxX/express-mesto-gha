/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { signin, signup } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const User = require('./models/user');

const router = express.Router();

mongoose.set('strictQuery', false);
const app = express();
const PORT = 3000;
mongoose.set('runValidators', true);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) { console.log(err); } else console.log('MongoDB is connected');
});

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    password: Joi.string().required().min(2).max(30),
    avatar: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), signup);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(2).max(30),
  }),
}), signin);

app.use(authMiddleware);

app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не существует' }));

app.use(errors());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
