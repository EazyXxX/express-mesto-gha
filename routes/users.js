const users = require('express').Router();
const { getUserValidation, updateUserProfileValidation, updateUserAvatarValidation } = require('../validation/validation');
const {
  getUser, getUsers, updateUserProfile, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:userId', getUserValidation, getUser);
users.patch('/me', updateUserProfileValidation, updateUserProfile);
users.patch('/me/avatar', updateUserAvatarValidation, updateUserAvatar);
users.get('/me', getUserInfo);

module.exports = users;
