'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  BlogSchema = new Schema({
    header: {
      type: String,
      required: [true, 'Укажите заголовок статьи']
    },
    href: {
      type: String,
      required: [true, 'Укажите ссылку']
    },
    content: {
      type: String,
      required: [true, 'Укажите содержимое статьи']
    },
    date: {
      type: String, 
      // default: Date.now,
      required: [true, 'Укажите дату публикации']
    }
  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('blogs', BlogSchema);