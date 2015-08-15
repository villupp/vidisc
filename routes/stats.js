var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('statistics', { title: 'ejs' });
});

router.get('/player', function(req, res, next) {
  res.render('player-statistics', { title: 'ejs' });
});

module.exports = router;
