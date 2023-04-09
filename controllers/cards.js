const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  const newCard = new Card({ name, link, owner });
  Card.populate(newCard, { path: 'owner' });
  newCard.save()
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new UnauthorizedError());
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .then(() => res.send({ message: `Карточка ${cardId} удалена` }))
          .catch(() => res.send(new NotFoundError()));
      } else {
        next(new ConflictError());
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error(err);
        return next(new BadRequestError());
      }
      console.error(err);
      return next(new BadRequestError());
    });
};

const updateLike = (req, res, next, method) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { [method]: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        next(new NotFoundError());
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(new BadRequestError().statusCode).send({ message: new BadRequestError().message });
      } else {
        next(new NotFoundError());
      }
    });
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
