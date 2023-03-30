/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const { CodeSuccess } = require('../statusCode');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');
const { EmailExistsError } = require('../errors/EmailExistsError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../config');

const getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
  }
  // достаём юзера из БДшки
  User
    .findById(payload._id)
    .orFail(() => res.status(NotFoundError.statusCode).send({ message: NotFoundError.message }))
    .then((user) => {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
        .then((users) => res.send(users));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  // проверяем токен
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
  }

  let payload;
  const jwt = authorization.replace('Bearer ', '');
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
  }
  // достаём юзера из ДБшки
  User
    .findById(payload._id)
    .orFail(() => res.status(NotFoundError.statusCode).send({ message: NotFoundError.message }))
    .then((user) => res.send(user))
    .catch(() => {
      res.status(NotFoundError.statusCode).send({ message: NotFoundError.message });
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(() => res.json(avatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next(ServerError);
      }
    });
};

const signup = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CodeSuccess.CREATED).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(401).send({ message: 'Необходима авторизация' });
    } if (e.code === 11000) {
      return res.status(409).send({ message: 'Пользователь с такими данными уже существует' });
    }
    console.error(e);
    return res.status(ServerError.statusCode).send({ message: ServerError.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (user === null) {
      return res.status(401).send({ message: 'Неправильные почта или пароль.' });
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // хеши не совпали — отклоняем промис
      return res.status(401).send({ message: 'Неправильные почта или пароль.' });
    }

    const token = jsonwebtoken.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные при создании.' });
    }
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка при попытке создать пользователя.' });
  }
};

const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  signup, getUser, getUsers, updateUserProfile, updateUserAvatar, signin, getUserInfo,
};
