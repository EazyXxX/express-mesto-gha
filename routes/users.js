const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getUser, getUsers, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', celebrate({
  body: Joi.object({
    _id: Joi.string().hex().length(24),
  }),
}), getUser);
users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserProfile);
users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), updateUserAvatar);
users.get('/me', getUserInfo);

module.exports = users;
