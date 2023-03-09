const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Необходимо ввести имя'],
    minlength: [2, 'Имя должно быть больше двух символов'],
    maxlength: [30, 'Имя должно быть меньше 30 символов'],
  },
  about: {
    type: String,
    minlength: [2, 'Описание должно быть больше 2 символов'],
    maxlength: [30, 'Описание должно быть меньше 30 символов'],
    required: [true, 'Необходимо ввести описание'],
  },
  avatar: {
    type: String,
    required: [true, 'Необходимо добавить аватар'],
  },
});

module.exports = mongoose.model('user', userSchema);
