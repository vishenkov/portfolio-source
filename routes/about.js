var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
let tech = require('../models/tech.json');


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Обо мне'
  };
  Object.assign(obj, req.app.locals.settings);
  const Model = mongoose.model('skills');
  //получаем список записей в блоге из базы
  Model
    .find()
    .then(items => {
      let form = items.reduce((prev, cur) => {
        prev[cur.section] = cur.items.reduce((prev, cur) => {
          prev[cur.name] = cur.value;
          return prev;
        }, {});

        return prev;
      }, {});
      console.log(form);
      console.log(tech);
      // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
      Object.assign(obj, { tech: tech, form: form });
      res.render('pages/about', obj);
    });
});

module.exports = router;
