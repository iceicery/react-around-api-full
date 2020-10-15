const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUsersData = (req, res) => {
  User.find({})
    .then((user) => res.status(StatusCodes.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const getOneUser = (req, res) => {
  User.findById(req.params.cardId)
    .then((user) => res.status(StatusCodes.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'User not found' });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const createUser = (req, res) => {
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
      user.save().then((userData) => res.status(StatusCodes.OK).send({ data: userData }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          if (err.code === 11000) {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: 'User email already exists.' });
          }
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
        });
    });
};

const updateProfile = (req, res) => {
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
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
