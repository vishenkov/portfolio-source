var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const config = require('../config.json');
let tech = require('../models/tech.json');



const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  //если нет, то перебросить пользователя на главную страницу сайта
  res.redirect('/');
};

router.get('/', isAdmin, function (req, res) {
  let obj = {
    title: 'Admin page'
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
      res.render('pages/admin', obj);
    });
  // res.render('pages/admin', obj);
});

router.post('/works', isAdmin, function (req, res) {
  console.log("works upload");
  let form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    if (err) {
      return res.json({status: 'Не удалось загрузить картинку'});
    }
    const Model = mongoose.model('works');

    fs.rename(files.photo.path, path.join(config.upload, files.photo.name), function (err) {
      if (err) {
        fs.unlink(path.join(config.upload, files.photo.name));
        fs.rename(files.photo.path, files.photo.name);
      }
      let dir = config
        .upload
        .substr(config.upload.indexOf('/'));
      const item = new Model({name: fields.name, tech: fields.tech, href: fields.href, img: path.join(dir,files.photo.name)});
      item
        .save()
        .then(
            i => res.json({status: 'Работа успешно загружена'}),
            e => res.json({status: e.message})
        );
    });
  });
});

router.post('/blog', isAdmin, (req, res) => {
  console.log("blog upload");
  
  if (!req.body.header || !req.body.date || !req.body.content || !req.body.href) {
    return res.json({status: 'Укажите данные!'});
  }
  console.log(req.body.header+" "+req.body.date+" "+ req.body.content+" "+ req.body.href);
  const Model = mongoose.model('blogs');
  console.log(Model);
  const item = new Model({header: String(req.body.header), href: String(req.body.href), content: String(req.body.content), date: String(req.body.date)});
  console.log(item);
  item
        .save()
        .then(
            i => res.json({status: 'Запись успешно загружена'}),
            e => res.json({status: e.message})
        );
});

router.post('/about',isAdmin, (req, res) => {
  let Model = mongoose.model('skills');
  let models = [];

  Object.keys(req.body).map(section => ({
    section:section,
    items: Object.keys(req.body[section]).map (i => ({
      name: i,
      value: req.body[section][i]
    }))
  })).forEach(toSave => models.push(new Model(toSave)));

  if (models.filter(m => m.validateSync()).length) {
    return res.json({ error: 'Не удалось сохранить данные'});
  }

  Model.remove({}).then(()=>
    Model.insertMany(models).then(() =>
      res.json({message: 'Saved'})
    )
  );
});

module.exports = router;
