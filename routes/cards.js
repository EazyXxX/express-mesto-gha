const cards = require('express').Router();
const {
  getCardsValidation, createCardValidation, deleteCardValidation, likeCardValidation, deleteLikeCardValidation,
} = require('../validation/validation');
const {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cards.get('/', getCardsValidation, getCards);
cards.post('/', createCardValidation, createCard);
cards.delete('/:cardId', deleteCardValidation, deleteCard);
cards.put('/:cardId/likes', likeCardValidation, likeCard);
cards.delete('/:cardId/likes', deleteLikeCardValidation, deleteLikeCard);

module.exports = cards;
