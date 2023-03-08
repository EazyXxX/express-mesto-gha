const users = require('express').Router();

const {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:usersId', getUser);
users.post('/', createUser);
users.patch('/me', updateUserProfile);
users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
