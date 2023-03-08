/* eslint-disable no-shadow */
const Card = require('../models/card');
const { CodeError, CodeSuccess } = require('../statusCode');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (err) {
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Некорректные данные при создании карточки' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(CodeError.NOT_FOUND).send({ message: `Карточка ${cardId} не найдена` });
    }
    await Card.findByIdAndRemove(cardId);
    return res.send({ message: `Карточка ${cardId} удалена` });
  } catch (err) {
    if (err.name === 'CastError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Передан некорректный id карточки.' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'При попытке удалить карточку произошла ошибка' });
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
      return res.status(CodeError.NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }
    return res.send({ likes: card.likes });
  } catch (err) {
    if (err.name === 'CastError') {
      console.error(err);
      return res.status(CodeError.BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
    }
    console.error(err);
    return res.status(CodeError.SERVER_ERROR).send({ message: 'Произошла ошибка' });
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
