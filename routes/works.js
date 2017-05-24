var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const config = require('../config.json');



router.get('/', function(req, res, next) {
  let obj = {
    title: 'Мои работы'
  };
  Object.assign(obj, req.app.locals.settings);
  const Model = mongoose.model('works');
    //получаем список записей в блоге из базы
  Model
    .find()
    .then(works => {
      console.log(works);
      // обрабатываем шаблон и отправляем его в браузер передаем в шаблон список
      // записей в блоге
      Object.assign(obj, {works: works});
      res.render('pages/works', obj);
    });
});

router.post('/', function (req, res) {
    //требуем наличия имени, обратной почты и текста
  if (!req.body.name || !req.body.email || !req.body.text) {
    //если что-либо не указано - сообщаем об этом
    return res.json({status: 'Укажите данные!'});
  }
    //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text: req
    .body
    .text
    .trim()
    .slice(0, 500) + `\n Отправлено с: <${req.body.email}>`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function (error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.json({status: 'При отправке письма произошла ошибка'});
    }
    res.json({status: 'Письмо успешно отправлено'});
  });
});

module.exports = router;
