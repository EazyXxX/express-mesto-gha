const users = require('express').Router();

const {
  createUser, getUser, getUsers, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:id', getUser);
users.post('/users', createUser);
users.patch('/users/me', updateUserProfile);
users.patch('/users/me/avatar', updateUserAvatar);

module.exports = users;
