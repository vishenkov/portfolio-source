var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Блог'
  };
  Object.assign(obj, req.app.locals.settings);
  const Model = mongoose.model('blogs');
    //получаем список записей в блоге из базы
  Model
    .find()
    .then(blogs => {
      // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
      // записей в блоге
      Object.assign(obj, {blogs: blogs});
      res.render('pages/blog', obj);
    });
});

module.exports = router;
