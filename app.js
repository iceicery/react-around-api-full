const StatusCodes = require('http-status-codes');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controller/users');
const auth = require('./middleware/auth');
const { validateUser } = require('./middleware/validateData');

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(/^https?:\/\/(www.)?([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+\.+([A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=](%[0-9a-fA-F]{2})?)+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', login);
app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});
app.use(errors);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});
app.listen(PORT);
