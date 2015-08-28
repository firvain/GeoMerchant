var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.params);
  var data={};
    if (!req.params.lang) {
      data={
       lang: 'en',
            title: 'Geomerchant',
            intro: 'hello' 
          };
        res.render('index', data);
    } else if (req.params.lang === 'el'){
      data={
       lang: 'el',
            title: 'Geomerchant',
            intro: 'Καλησπερα' 
          };
      res.render('index',data);
    }
});

module.exports = router;
