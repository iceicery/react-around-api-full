const usersRouter = require('express').Router();
const {
  getUsersData, getOneUser, updateProfile, updateAvatar,
} = require('../controller/users');

usersRouter.get('/', getUsersData);
usersRouter.get('/:userId', getOneUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
