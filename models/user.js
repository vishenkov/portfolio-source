'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  UserSchema = new Schema({
    login: {
      type: String,
      required: [true, 'Укажите логин']
    },
    password: {
      type: String,
      required: [true, 'Укажите пароль']
    }
  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('user', UserSchema);