var express = require('express');
var router = express.Router();
console.log(router.param);
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
router.get('/en', function(req, res, next) {
    var data = {};
        data = {
            lang: 'en',
            title: 'Geomerchant',
           languageChooser: 'Choose Language'
        };
        res.render('index', data);
        
});

module.exports = router;
