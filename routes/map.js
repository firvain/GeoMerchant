var express = require('express');
var router = express.Router();
/* GET map page. */
router.get('/:lang', function(req, res, next) {
  var data = {};
  if (req.params.lang === 'en') {
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
      chooseArea : 'Choose Area of Search',
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
      email: 'Email'
    };
    res.render('map', data);
  } else if (req.params.lang === 'el') {
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
      chooseArea : 'Επιλογή Περιοχής για Αναζήτηση',
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
      email: 'Ηλεκτρονική Διεύθυνση'
    };
    res.render('map', data);
  }
});
module.exports = router;
