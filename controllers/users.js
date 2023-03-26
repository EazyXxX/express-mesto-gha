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
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next(ServerError);
      }
    });
};

const register = async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const {
      name, about, avatar, email,
    } = req.body;
    const user = await User.create({
      name, about, avatar, email, password,
    });
    return res.status(CodeSuccess.CREATED).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(401).send({ message: 'Переданы некорректные данные при создании.' });
    }
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка при попытке создать пользователя.' });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  User
    .findOne({ username: email }).select('+password')
    .orFail(() => res.status(NotFoundError).send({ message: NotFoundError.message }))
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      }
      return res.status(NotFoundError.statusCode).send({ message: NotFoundError.message });
    }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', 'token', { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ user, jwt });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  register, getUser, getUsers, updateUserProfile, updateUserAvatar, login, getUserInfo,
};
