var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const crypto = require('crypto');


/* GET home page. */
router.get('/', function(req, res, next) {
  let obj = {
    title: 'Главная страница'
  };
  Object.assign(obj, req.app.locals.settings);
  res.render('pages/index', obj);
});

router.post('/', (req, res) => {
  console.log(req.body.login+"  "+req.body.password);
  //требуем наличия логина и пароля в теле запроса
  if (!req.body.login || !req.body.password) {
    //если не указан логин или пароль - сообщаем об этом
    console.log('первый if');
    return res.json({status: 'Укажите логин и пароль!'});
  }
    //получаем модель пользователя и шифруем введенный пароль
  const Model = mongoose.model('user');
    // password = crypto
    //   .createHash('md5')
    //   .update(req.body.password)
    //   .digest('hex');
  //пытаемся найти пользователя с указанным логином и паролем
  Model
    .find({login: req.body.login, password: req.body.password})
    .then(user => {
      //если такой пользователь не найден - сообщаем об этом
      if (!user.length) {
        res.json({status: 'Логин и/или пароль введены неверно!'});
      } else {
        // если найден, то делаем пометку об этом в сессии пользователя, который сделал
        // запрос
        req.session.isAdmin = true;
        res.json({status: 'Авторизация успешна!'});
      }
    });
});

module.exports = router;
