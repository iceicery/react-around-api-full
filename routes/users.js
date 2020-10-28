const usersRouter = require('express').Router();
const {
  getUsersData, getCurrentUser, updateProfile, updateAvatar,
} = require('../controller/users');

usersRouter.get('/', getUsersData);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
