const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const EmailExistsError = require('../errors/EmailExistsError');
const { JWT_SECRET } = require('../config');

const getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  // достаём юзера из БДшки
  User
    .findById(req.user._id)
    .orFail(() => res.send(new NotFoundError()))
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
        .then((users) => res.send(users));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  // достаём юзера из ДБшки
  User
    .findById(req.user._id)
    .orFail(() => res.send(new NotFoundError()))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError());
      }
      next(new NotFoundError());
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then(() => res.json(avatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError());
      } else {
        next(new NotFoundError());
      }
    });
};

const signup = async (req, res, next) => {
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
    return res.status(201).json(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      console.error(err);
      return next(new UnauthorizedError());
    } if (err.code === 11000) {
      return next(new EmailExistsError());
    }
    console.error(err);
    return next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    console.log(user);
    if (user === null) {
      next(new UnauthorizedError());
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      next(new UnauthorizedError());
    }

    const token = jsonwebtoken.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );
    return res.send({ token });
  } catch (e) {
    console.error(e);
    return next(e);
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
