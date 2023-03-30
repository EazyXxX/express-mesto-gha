const Card = require('../models/card');
const { CodeSuccess } = require('../statusCode');
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

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (card.owner === req.user._id) {
        Card.findByIdAndRemove(cardId);
        res.send({ message: `Карточка ${cardId} удалена` });
      } else {
        res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        console.error(e);
        return res.status(400).send({ message: 'Передан некорректный id карточки' });
      }
      console.error(e);
      return res.status(404).send({ message: `Произошла ошибка при попытке удалить карточку ${cardId}` });
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
        res.status(404).send({ message: 'Такой карточки нет' });
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
