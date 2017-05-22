var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Мои работы'
  };
  Object.assign(obj, req.app.locals.settings);
  res.render('pages/works', obj);
});

module.exports = router;
