var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('initgame', { title: 'ejs' });
});

router.get('/play', function(req, res, next) {
  res.render('game', { title: 'ejs' });
});

module.exports = router;
