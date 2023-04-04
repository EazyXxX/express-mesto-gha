const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const CodeSuccess = require('../statusCode');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ServerError = require('../errors/ServerError');
const EmailExistsError = require('../errors/EmailExistsError');
const { JWT_SECRET } = require('../config');

const getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { authorization } = req.headers;
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
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
        .then((users) => res.send(users));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next(err);
      }
    });
};

const getUser = (req, res) => {
  // проверяем токен
  const { authorization } = req.headers;

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
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      }
      res.status(NotFoundError.statusCode).send({ message: NotFoundError.message });
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(() => res.json(avatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        next();
      }
    });
};

const signup = async (req, res) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name, about, avatar, email, password: hash,
    });
    const user = ({
      name, about, avatar, email, password,
    });
    return res.status(CodeSuccess.CREATED).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error(err);
      return res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
    } if (err.code === 11000) {
      return res.status(EmailExistsError.statusCode).send({ message: EmailExistsError.message });
    }
    console.error(err);
    return res.status(ServerError.statusCode).send({ message: ServerError.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (user === null) {
      res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      // хеши не совпали — отклоняем промис
      res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
    }

    const token = jsonwebtoken.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (e) {
    console.error(e);
    return res.status(ServerError.statusCode).send({ message: ServerError.message });
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
