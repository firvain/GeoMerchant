var express = require('express');
var passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/map/login');
// var flash = require('connect-flash');
var router = express.Router();
/* GET users listing. */
router.get('/', ensureLoggedIn, function (req, res, next) {
  var data = {};
  var lang = String(req.flash('lang'));
  var id = String(req.flash('id'));
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
      user: req.user,
      btns: {
        insert: 'insert',
        delete: 'delete',
        update: 'update',
        logout: 'logout'
      },
      id: id
    };
    res.render('admin', data);
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
      user: req.user,
      btns: {
        insert: 'εισαγωγη',
        delete: 'διαγραφη',
        update: 'ενημερωση',
        logout: 'αποσυνδεση'
      },
      id: id
    };
    res.render('admin', data);
  }
});
module.exports = router;
