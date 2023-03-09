const mongoose = require('mongoose');

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
