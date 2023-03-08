const users = require('express').Router();

const {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:userId', getUser);
users.post('/users', createUser);
users.patch('/me', updateUserProfile);
users.patch('/me/avatar', updateUserAvatar);

module.exports = users;
