const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');

const getCardsData = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new NotFoundError(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send({ data: card });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name, link, likes, createAt,
  } = req.body;
  const card = new Card({
    name, link, owner: req.user._id, likes, createAt,
  });
  card.save().then((cardData) => {
    if (!cardData) {
      throw new BadRequestError(getReasonPhrase(StatusCodes.BAD_REQUEST));
    }
    res.status(StatusCodes.OK).send({ data: cardData })
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError(getReasonPhrase(StatusCodes.NOT_FOUND));
      }
      res.status(StatusCodes.OK).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      next(err);
    });
};

module.exports = {
  getCardsData, createCard, deleteCard, likeCard, dislikeCard,
};
