const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUsers, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUser);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), updateUserProfile);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), updateUserAvatar);
users.get('/me', getUserInfo);

module.exports = users;
