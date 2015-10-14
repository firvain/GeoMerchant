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
      search : 'Search',
      sale: 'Buy',
      rent: 'Rent',
      price:'Price',
      from:'From',
      to:'To',
      priceError:'Input is not a number!'
    };
    res.render('map', data);
  } else if (req.params.lang === 'el') {
    data = {
      lang: 'el',
      title: 'Geomerchant',
      basemap : 'Υπόβαθρο',
      search:'Αναζήτηση',
      // estateType:'Αγορά',
      sale:'Αγορά',
      rent:'Ενοικίαση',
      price:'Τιμή',
      from:'Από',
      to:'Εως',
      priceError:'Η τιμή δεν είναι αριθμός!',
    };
    res.render('map', data);
  }
});
module.exports = router;
