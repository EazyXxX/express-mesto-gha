const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Необходимо ввести название'],
      minlength: [2, 'Название должно быть больше 2 символов'],
      maxlength: [30, 'Название должно быть меньше 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Необходимо ввести ссылку'],
      default: 'https://avatars.mds.yandex.net/i?id=97ba28e7baae02eca7030a413cb10fd96cc1b2ec-9181668-images-thumbs&n=13',
      validate: {
        validator: (url) => isURL(url),
        message: 'Передан невалидный url адрес.',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Необходимы данные создателя карточки'],
      ref: 'user',
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
