var express = require('express');
var passport = require('passport');
var router = express.Router();
var flash = require('connect-flash');
var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
};
/* GET map page. */
router.get('/', function(req, res, next) {
  var lang = req.query.lang;
  var data = {};
  if (lang === 'en') {
    data = {
      lang: 'en',
      title: 'Geomerchant',
      basemap: 'BaseMap',
      search: 'Search',
      sale: 'Buy',
      rent: 'Rent',
      price: 'Price',
      from: 'From',
      to: 'To',
      priceError: 'Input is not a number!',
      estateCode: 'Estate Code',
      estateProperties: 'Estate Properites',
      chooseArea: 'Choose Area of Search',
      type: 'Type',
      area: 'Size',
      address: 'Address',
      bedrooms: 'Bedrooms',
      newbuild: 'Newly Build',
      parking: 'Parking',
      furnished: 'Furnished',
      pets: 'Pets Allowed',
      view: 'View',
      heating: 'Heating',
      cooling: 'Air Condition',
      contactInfo: 'Contact Info',
      name: 'Name',
      lastname: 'Last Name',
      phone: 'Telephone',
      email: 'Email',
      env: env
    };
    res.render('map', data);
  } else if (lang === 'el') {
    data = {
      lang: 'el',
      title: 'Geomerchant',
      basemap: 'Υπόβαθρο',
      search: 'Αναζήτηση',
      // estateType:'Αγορά',
      sale: 'Αγορά',
      rent: 'Ενοικίαση',
      price: 'Τιμή',
      from: 'Από',
      to: 'Εως',
      priceError: 'Η τιμή δεν είναι αριθμός!',
      estateCode: 'Κωδικός Ιδιοκτησίας',
      estateProperties: 'Χαρακτηριστικά Ακινήτου',
      chooseArea: 'Επιλογή Περιοχής για Αναζήτηση',
      type: 'Τύπος',
      area: 'Εμβαδό',
      address: 'Διευθυνση',
      bedrooms: 'Υπνοδωμάτια',
      newbuild: 'Νεόδμητο',
      parking: 'Στάθμεση',
      furnished: 'Επιπλωμένο',
      pets: 'Κατοικίδια',
      view: 'Θέα',
      heating: 'Θέρμανση',
      cooling: 'Κλιματισμός',
      contactInfo: 'Στοιχεία Επικοινωνίας',
      name: 'Όνομα',
      lastname: 'Επίθετο',
      phone: 'Τηλέφωνο',
      email: 'Ηλεκτρονική Διεύθυνση',
      env: env
    };
    res.render('map', data);
  }
});
router.get('/login', function(req, res) {
  res.render('login', {
    env: env
  });
});
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}), function(req, res) {
  var id = req.user._json.user_metadata.gid;
  req.flash('id', id);
  req.flash('lang', 'en');
  res.redirect(req.session.returnTo || '/admin');
});
module.exports = router;
