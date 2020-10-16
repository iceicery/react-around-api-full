const StatusCodes = require('http-status-codes');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controller/users');
const auth = require('./middleware/auth');

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();
const { PORT = 3000 } = process.env;
app.use(bodyParser.json());
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});
app.listen(PORT);
