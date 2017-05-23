'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  SkillsSchema = new Schema({
    section: {
      type: String
    },
    items: {
      type: [{
        name: {
          type: String
        },
        value: {
          type: Number,
          default: 0
        }
      }]
    }
  });

//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('skills', SkillsSchema);