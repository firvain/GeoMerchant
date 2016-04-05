var express = require('express');
var passport = require('passport');
var router = express.Router();
var flash = require('connect-flash');
var env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://127.0.0.1:3000/callback'
};
var lang;
/* GET map page. */
router.get('/', function(req, res, next) {
  lang = req.query.lang;
  var data = {};
  if (lang === 'en') {
    data = {
      lang: 'en',
      title: 'Geomerchant',
      basemap: 'BaseMap',
      btns: {
        clear: 'Clear',
        search: 'Search',
        sale: 'Buy',
        rent: 'Rent',
        parking: 'Parking',
        furnished: 'Furnished',
        pets: 'Pets Allowed',
        view: 'View',
        heating: 'Heating',
        cooling: 'Air Condition',
        newbuild: 'Newly Build'
      },
      price: 'Price',
      from: 'from',
      to: 'to',
      andMore : 'and more',
      priceError: 'Input is not a number!',
      estateCode: 'Estate Code',
      estateProperties: 'Choose Estate Properites',
      chooseArea: 'Choose Area of Search',
      listingType: 'Listing Type',
       estate:{
        title: 'Estate Type',
        type:{
          detached:'Detached House',
          apartment:'Apartment',
          store:'Store'
        }
      },
      area: 'Size',
      address: 'Address',
      bedrooms: 'Bedrooms',
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
      btns: {
        clear: 'Καθαρισμός',
        search: 'Αναζήτηση',
        sale: 'Αγορά',
        rent: 'Ενοικίαση',
        parking: 'Στάθμεση',
        furnished: 'Επιπλωμένο',
        pets: 'Κατοικίδια',
        view: 'Θέα',
        heating: 'Θέρμανση',
        cooling: 'Κλιματισμός',
        newbuild: 'Νεόδμητο'
      },
      // priceRangeTitle:'Ύψος Αμοιβής Κατοικίας',
      price: 'Τιμή',
      from: 'από',
      to: 'έως',
      andMore : 'και πάνω',
      priceError: 'Η τιμή δεν είναι αριθμός!',
      estateCode: 'Κωδικός Ιδιοκτησίας',
      estateProperties: 'Επιλέξτε Χαρακτηριστικά Ακινήτου',
      chooseArea: 'Επιλογή Περιοχής για Αναζήτηση',
      listingType: 'Είδος Αγγελίας',
      estate:{
        title: 'Τύπος Ιδιοκτησίας',
        type:{
          detached:'Μονοκατοικία',
          apartment:'Διαμέρισμα',
          store:'Κατάστημα'
        }
      },
      area: 'Εμβαδό',
      address: 'Διευθυνση',
      bedrooms: 'Υπνοδωμάτια',
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
router.get('/login', function (req, res) {
  res.render('login', {
    env: env
  });
});
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
router.get('/callback', passport.authenticate('auth0', {
  failureRedirect: '/'
}), function (req, res) {
  var id = req.user._json.user_metadata.gid;
  req.flash('id', id);
  req.flash('lang', lang);
  res.redirect(req.session.returnTo || '/admin');
});
module.exports = router;
