var express = require('express');
var router = express.Router();

/* GET map page. */
router.get('/:lang', function(req, res, next) {

  var data={};
    if (req.params.lang === 'en') {
      data={
       lang: 'en',
            title: 'Geomerchant',
            map: '2' 
          };
        res.render('map', data);
    } else if (req.params.lang === 'el'){
      data={
       lang: 'el',
            title: 'Geomerchant',
            map: '1' 
          };
      res.render('map',data);
    }
});

module.exports = router;
