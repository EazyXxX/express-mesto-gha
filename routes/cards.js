const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), createCard);
cards.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
  }).unknown(true),
}), deleteCard);
cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', deleteLikeCard);

module.exports = cards;
