'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  WorksSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Укажите название']
    },
    tech: {
      type: String,
      required: [true, 'Укажите технологии']
    },
    href: {
      type: String,
      required: [true, 'Укажите ссылку']
    },
    img: {
      type: String,
      required: [true, 'Укажите картинку']
    }
  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('works', WorksSchema);