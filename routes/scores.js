var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('scorecards', { title: 'ejs' });
});

router.get('/scorecard', function(req, res, next) {
  res.render('scorecard', { title: 'ejs' });
});

module.exports = router;
