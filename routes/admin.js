var express = require('express');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/login');
var router = express.Router();
// require('./i8n/en.js');
/* GET users listing. */
router.get('/', ensureLoggedIn, function (req, res, next) {
  var data = {};
  var lang = String(req.flash('lang'));
  var id = String(req.flash('id'));
  if (lang === 'en') {
    data = require('./i8n/admin_en.js');
    data.id = id;
    data.user = req.user;
    res.render('admin', data);
  } else {
    data = require('./i8n/admin_el.js');
    data.id = id;
    data.user = req.user;
    res.render('admin', data);
  }
});
module.exports = router;
