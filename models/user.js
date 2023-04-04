const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { isEmail, isURL } = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя должно быть больше двух символов'],
    maxlength: [30, 'Имя должно быть меньше 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Описание должно быть больше 2 символов'],
    maxlength: [30, 'Описание должно быть меньше 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => isURL(url),
      message: 'Передан невалидный url адрес.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неправильный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
