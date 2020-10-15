const usersRouter = require('express').Router();
const {
  getUsersData, getOneUser, createUser, updateProfile, updateAvatar,
} = require('../controller/users');

usersRouter.get('/users', getUsersData);
usersRouter.get('/users/:cardId', getOneUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
