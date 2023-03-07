/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const { CodeError, CodeSuccess } = require('../statusCode');

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({ name, about, avatar });
    return res.status(CodeSuccess.CREATED).json(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании.' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка при попытке создать пользователя.' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(CodeError.NOT_FOUND).send({ message: `Пользователь по указанному _id: ${userId} не найден.` });
    }
    return res.json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Передан некорректный id' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    return res.json({ name, about });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные для изменения информации данные' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка при попытке изменить данные пользователя' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    return res.json({ avatar });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Переданы некорректные данные для изменения фотографии профиля.' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка при попытке изменить фото профиля.' });
  }
};

module.exports = {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar,
};
