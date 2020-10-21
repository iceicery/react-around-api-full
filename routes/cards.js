const cardsRouter = require('express').Router();
const {
  getCardsData, deleteCard, createCard, likeCard, dislikeCard
} = require('../controller/cards');

cardsRouter.get('/', getCardsData);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCard);
module.exports = cardsRouter;
