/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Некорректные данные при создании пользователя ${err}` });
      } else {
        res.status(500).send({ message: `Внутренняя ошибка сервера при попытке создать пользователя ${err}` });
      }
    });
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      return res.status(404).send({ message: `Пользователь по указанному _id: ${userId} не найден.` });
    }

    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    await User.findByIdAndUpdate(req.user._id, { name, about }, { new: true });
    return res.status(200).json({ name, about });
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные для изменения информации данные' });
    }
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка при попытке изменить данные пользователя' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
    return res.status(200).json({ avatar });
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(400).send({ message: 'Переданы некорректные данные для изменения фотографии профиля.' });
    }
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка при попытке изменить фото профиля.' });
  }
};

module.exports = {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar,
};
