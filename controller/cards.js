const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const Card = require('../models/card');

const getCardsData = (req, res) => {
  Card.find({})
    .then((card) => res.status(StatusCodes.OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const createCard = (req, res) => {
  const {
    name, link, likes, createAt,
  } = req.body;
  const card = new Card({
    name, link, owner: req.user._id, likes, createAt,
  });
  card.save().then((cardData) => res.status(StatusCodes.OK).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST)
          .send({ message: getReasonPhrase(StatusCodes.BAD_REQUEST) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(StatusCodes.OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }).then((card) => res.status(StatusCodes.OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }).then((card) => res.status(StatusCodes.OK).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(StatusCodes.NOT_FOUND)
          .send({ message: getReasonPhrase(StatusCodes.NOT_FOUND) });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
    });
};

module.exports = {
  getCardsData, createCard, deleteCard, likeCard, dislikeCard,
};
