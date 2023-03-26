/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, register } = require('./controllers/users');
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
  if (err) { console.log(err); } else console.log('mongdb is connected');
});

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', login);
app.post('/register', register);

app.use(authMiddleware);

app.use('/users', users);
app.use('/cards', cards);

app.use(errors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
