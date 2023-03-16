/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const Card = require('../models/card');
const { CodeSuccess } = require('../statusCode');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    next(ServerError);
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner });
    return res.status(CodeSuccess.CREATED).json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    if (req.user._id) {
      if (await Card.findById(cardId) === null) {
        next(NotFoundError);
      }
      await Card.findByIdAndRemove(cardId);
      return res.send({ message: `Карточка ${cardId} удалена` });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const updateLike = async (req, res, method) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { [method]: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(NotFoundError);
    }
    return res.send({ likes: card.likes });
  } catch (err) {
    if (err.name === 'CastError') {
      next(BadRequestError);
    }
    next(ServerError);
  }
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');
const deleteLikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
