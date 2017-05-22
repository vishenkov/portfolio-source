var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Обо мне'
  };
  Object.assign(obj, req.app.locals.settings);
  res.render('pages/about', obj);
});

module.exports = router;
