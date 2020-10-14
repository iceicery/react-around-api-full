const cardsRouter = require('express').Router();
const {
  getCardsData, deleteCard, createCard, likeCard, dislikeCard
} = require('../controller/cards');

cardsRouter.get('/cards', getCardsData);
cardsRouter.post('/cards', createCard);
cardsRouter.delete('/cards/:cardId', deleteCard);
cardsRouter.put('/cards/:cardId/likes', likeCard);
cardsRouter.delete('/cards/:cardId/likes', dislikeCard);
module.exports = cardsRouter;
