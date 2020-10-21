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
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'Data not found' });
      }
      next(err);
    });
};

const getOneUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('No user with matching ID found');
      }
      res.status(StatusCodes.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'No user with matching ID found' });
      }
      next(err);
    });
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
        if (!userData) {
          throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
        }
        res.status(StatusCodes.OK).send({ data: userData });
      })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
          }
          if (err.name === 'MongoError') {
            return res.status(StatusCodes.BAD_REQUEST)
              .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
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
    })
    .then((user) => {
      if (!user) {
        throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
      }
      res.status(StatusCodes.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    { avatar: 'https://www.NEWLINK.jpg' },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .then((user) => {
      if (!user) {
        throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
      }
      res.status(StatusCodes.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnAuthorizedError('Incorrect email or password');
      }
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
      if (err.name === 'Error') {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ message: 'Incorrect email or password' });
      }
      next(err);
    });
};

module.exports = {
  getUsersData, getOneUser, createUser, updateProfile, updateAvatar, login,
};
