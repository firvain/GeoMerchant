var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {};
  data = {
    lang: 'el',
    title: 'Geomerchant',
    languageChooser: 'Επιλέξτε Γλώσσα'
  };
  res.render('index', data);
});
module.exports = router;
