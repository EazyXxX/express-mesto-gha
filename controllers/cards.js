const Card = require('../models/card');
const { CodeSuccess } = require('../statusCode');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ServerError } = require('../errors/ServerError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => { res.status(CodeSuccess.CREATED).send(card); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(401).send({ message: 'В запросе указаны неправильные данные' });
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  if (req.user._id) {
    Card.findById(cardId)
      .then((card) => card.json())
      .then(() => res.status(NotFoundError.statusCode)
        .send({ message: NotFoundError.message }));
    Card.findByIdAndRemove(cardId)
      .then(() => res.send({ message: `Карточка ${cardId} удалена` }))
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(BadRequestError.statusCode).send({ message: BadRequestError.message });
        } else {
          next(err);
        }
      });
  }
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
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        next(ServerError);
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
