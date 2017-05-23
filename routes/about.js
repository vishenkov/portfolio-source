var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Обо мне'
  };
  Object.assign(obj, req.app.locals.settings);
  const Model = mongoose.model('skills');
  //получаем список записей в блоге из базы
  Model
    .find()
    .then(skills => {
      // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
      Object.assign(obj, {skills: skills});
      res.render('pages/about', obj);
    });
});

module.exports = router;
