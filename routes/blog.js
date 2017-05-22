var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  let obj = {
    title: 'Блог'
  };
  Object.assign(obj, req.app.locals.settings);
  res.render('pages/blog', obj);
});

module.exports = router;
