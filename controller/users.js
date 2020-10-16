const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const UnAuthorizedError = require('../errors/unauthorized-err');
const User = require('../models/user');

const getUsersData = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Data not found');
      }
      res.status(StatusCodes.OK).send({ data: user });
    })
    .catch(next);
};

const getOneUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      res.status(StatusCodes.OK).send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      const user = new User({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
      user.save().then((userData) => {
        res.status(StatusCodes.OK).send({ data: userData });
      })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          if (err.name === 'MongoError') {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: 'User email already exists.' });
          }
          next(err);
        });
    });
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    {
      name: 'newName',
      about: 'newAbout',
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }).then((user) => res.status(StatusCodes.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id,
    { avatar: 'https://www.NEWLINK.jpg' },
    {
      new: true,
      runValidators: true,
      upsert: true,
    }).then((user) => res.status(StatusCodes.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-key',
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ message: getReasonPhrase(StatusCodes.UNAUTHORIZED) });
    });
};

module.exports = {
  getUsersData, getOneUser, createUser, updateProfile, updateAvatar, login,
};
