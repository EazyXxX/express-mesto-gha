const mongoose = require('mongoose');
const Card = require('../models/card');
const { CodeSuccess } = require('../statusCode');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ServerError = require('../errors/ServerError');
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
      res.status(CodeSuccess.CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(UnauthorizedError.statusCode).send({ message: UnauthorizedError.message });
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .then(() => res.send({ message: `Карточка ${cardId} удалена` }))
          .catch(() => res.status(NotFoundError).send({ message: NotFoundError.message }));
      } else {
        res.status(ConflictError.statusCode).send({ message: ConflictError.message });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error(err);
        return res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      }
      console.error(err);
      return res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
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
        res.status(NotFoundError.statusCode).send({ message: NotFoundError.message });
      } else {
        res.send({ likes: card.likes });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
      } else {
        res.status(ServerError.statusCode).send({ message: ServerError.message });
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
