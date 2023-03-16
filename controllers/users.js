/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CodeSuccess } = require('../statusCode');
const { BadRequestError } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');
const { EmailExistsError } = require('../errors/EmailExistsError');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    next(ServerError);
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name, about, avatar, email,
    } = req.body;
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hash,
    });
    return res.status(CodeSuccess.CREATED).json(user);
  } catch (err) {
    if (err.code === 11000) {
      next(EmailExistsError);
    }
    if (err.name === 'ValidationError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      next(NotFoundError);
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    return res.json({ name, about });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    return res.json({ avatar });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    await User.findUserByCredentials(email, password).select('+password');
    const token = jwt.sign({ _id: 'd285e3dceed844f902650f40' }, '1hf8r041jf5f2hf7j0fbv6zx2', { expiresIn: '7d' });
    res.cookie('jwt', 'token', { maxAge: 3600000 * 24 * 7, httpOnly: true });
    return token;
  } catch (err) {
    next(UnauthorizedError);
  }
};

const getUserInfo = async (req) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    return user;
  } catch (err) {
    next(NotFoundError);
  }
};

module.exports = {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar, login, getUserInfo,
};
