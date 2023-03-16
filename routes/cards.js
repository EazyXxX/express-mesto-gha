const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
  }),
}), createCard);
cards.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
}), deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', deleteLikeCard);

module.exports = cards;
