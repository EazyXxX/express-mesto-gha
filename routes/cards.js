const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, likeCard, deleteLikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), createCard);
cards.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    _id: Joi.string().hex().length(24),
    authorization: Joi.string(),
  }),
}), deleteCard);
cards.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    _id: Joi.string().hex().length(24),
    authorization: Joi.string(),
  }).unknown(true),
}), likeCard);
cards.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    _id: Joi.string().hex().length(24),
    authorization: Joi.string(),
  }).unknown(true),
}), deleteLikeCard);

module.exports = cards;
