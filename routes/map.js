var express = require('express');
var router = express.Router();
/* GET map page. */
router.get('/:lang', function(req, res, next) {
  var data = {};
  if (req.params.lang === 'en') {
    data = {
      lang: 'en',
      title: 'Geomerchant',
      basemap : 'BaseMap',
      search : 'Search'
    };
    res.render('map', data);
  } else if (req.params.lang === 'el') {
    data = {
      lang: 'el',
      title: 'Geomerchant',
      basemap : 'Υπόβαθρο',
      search:'Αναζήτηση'
    };
    res.render('map', data);
  }
});
module.exports = router;
