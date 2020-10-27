const usersRouter = require('express').Router();
const {
  getUsersData, getOneUser, getCurrentUser, updateProfile, updateAvatar,
} = require('../controller/users');

usersRouter.get('/', getUsersData);
//usersRouter.get('/:userId', getOneUser);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
