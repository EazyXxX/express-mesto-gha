/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const owner = req.user._id;
    const { name, link } = req.body;
    await Card.create({ name, link, owner });
    return res.status(201).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error(e);
      return res.status(400).send({ message: 'Некорректные данные при создании карточки' });
    }
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const admin = req.user._id;
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card === null) {
      return res.status(404).send({ message: `Карточка ${cardId} не найдена` });
    }

    const owner = card.owner.toHexString();

    if (owner !== admin) {
      return res.status(500).send({ message: 'Удалять можно только свои карточки' });
    }
    await Card.findByIdAndRemove(cardId);
    return res.status(200).send({ message: `Карточка ${cardId} удалена` });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'При попытке удалить карточку произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );

    const card = await Card.findById(cardId);
    return res.status(200).json(card.likes);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка.' });
  }
};

const deleteLikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );

    const card = await Card.findById(cardId);
    return res.status(200).json(card.likes);
  } catch (e) {
    console.error(e);
    return res.status(500).send({ message: 'Произошла ошибка.' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
