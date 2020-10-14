const StatusCodes = require('http-status-codes');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
const app = express();
const { PORT = 3000 } = process.env;
//Temporary Authorization Solution
app.use((req, res, next) => {
  req.user = {
    _id: '5f643404e41c1173b0f24d05',
  };

  next();
});
app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND)
    .send({ message: 'Requested resource not found' });
});
app.listen(PORT);
