function handleInfo(evt) {
  var coordinate = evt.coordinate;
  var obj = {};
  var title = {};
  var owner = {};
  var features = [];
  var clickedFeature;
  var f;
  map.removeInteraction(draw);
  evt.preventDefault();
  obj.title = title;
  if (lang === 'el') {
    title.gid = 'Κωδικός Ιδιοκτησίας';
    title.type = 'Είδος Ιδιοκτησίας';
    title.listing_type = 'Τύπος Αγγελίας';
    title.area = 'Εμβαδό';
    title.address = 'Διευθυνση';
    title.bedrooms = 'Υπνοδωμάτια';
    title.price = 'Τιμή';
    title.isnew = 'Νεόδμητο';
    title.parking = 'Στάθμεση';
    title.furnished = 'Επιπλωμένο';
    title.pets = 'Κατοικίδια';
    title.view = 'Θέα';
    title.heating = 'Θέρμανση';
    title.cooling = 'Ψύξη';
    title.contactInfo = 'Στοιχεία Επικοινωνίας';
    title.name = 'Όνομα';
    title.lastname = 'Επίθετο';
    title.phone = 'Τηλέφωνο';
    title.email = 'Ηλεκτρονική Διεύθυνση';
  } else {
    title.gid = 'Estate Code';
    title.type = 'Property Type';
    title.listing_type = 'Listing Type';
    title.area = 'Size';
    title.address = 'Address';
    title.bedrooms = 'Bedrooms';
    title.price = 'Price';
    title.isnew = 'Newly Build';
    title.parking = 'Parking';
    title.furnished = 'Furnished';
    title.pets = 'Pets Allowed';
    title.view = 'View';
    title.heating = 'Heating';
    title.cooling = 'Cooling';
    title.contactInfo = 'Contact Info';
    title.name = 'Name';
    title.lastname = 'Last Name';
    title.phone = 'Telephone';
    title.email = 'Email';
  }
  clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
    return {
      feature: feature,
      layer: layer
    };
  }, this, function(layer) {
    if (layer.get('id') === 'estates' || layer.get('id') === 'filteredEstates') {
      return true;
    }
  }, this);
  if (clickedFeature) {
    if (clickedFeature.layer.get('id') === 'estates' && clickedFeature.feature.get('features').length === 1) {
      f = clickedFeature.feature.getProperties().features[0];
      console.log(f);
      createPSAandCard(f, obj);
    } else if (clickedFeature.layer.get('id') === 'filteredEstates') {
      f = clickedFeature.feature;
      createPSAandCard(f, obj);
    }
  } else {
    PSA.setSource(null);
  }
}

function createPSAandCard(f, obj) {
  var feature = {};
  feature.gid = f.get('gid');
  feature.area = f.get('estatearea');
  if (lang === 'el') {
    feature.type = f.get('estatetype');
    feature.address = f.get('street_el') + ' ' + f.get('street_number');
    feature.name = f.get('name_el');
    feature.lastname = f.get('lastname_el');
    if (f.get('sale') === true) {
      feature.listing_type = 'Πώληση'
    } else {
      feature.listing_type = 'Ενοικίαση'
    }
    feature.btns = {
      info: 'πληροφοριες',
      close: 'κλεισιμο'
    }
  } else {
    feature.type = f.get('estatetype_en');
    feature.address = f.get('street_en') + ' ' + f.get('street_number');
    feature.name = f.get('name_en');
    feature.lastname = f.get('lastname_en');
    if (f.get('sale') === true) {
      feature.listing_type = 'Sale'
    } else {
      feature.listing_type = 'Rent'
    }
    feature.btns = {
      info: 'info',
      close: 'close'
    }
  }
  feature.bedrooms = f.get('bedrooms');
  feature.price = f.get('price');
  feature.isnew = f.get('isnew');
  feature.parking = f.get('parking');
  feature.furnished = f.get('furnished');
  feature.pets = f.get('pets');
  feature.view = f.get('view');
  feature.heating = f.get('heating');
  feature.cooling = f.get('cooling');
  feature.phone = f.get('phone1');
  feature.email = f.get('email');
  feature.coordinate = f.get('geometry').getCoordinates();

  var PSASource = new ol.source.Vector({
    attributions: [new ol.Attribution({
      html: 'POI by ' + '<a href="http://www.terracognita.gr/">Terra Cognita</a>'
    })],
    format: geoJSONFormat,
    loader: function(extent, resolution, projection) {
      var url = 'http://localhost:3000/db/uses/' + feature.gid;
      var self = this;
      $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json'
      }).done(function(response) {
        var features = geoJSONFormat.readFeatures(response.property_services_analysis, {
          featureProjection: 'EPSG:3857'
        });
        var area = new ol.style.Style({
          fill: new ol.style.Fill({
            color: [156, 39, 176, 0.1]
          })
        });
        features[0].setStyle(area);
        self.addFeatures(features);
      }).fail(function() {
        console.log('error');
      });
    },
    strategy: ol.loadingstrategy.all
  });
  PSA.setSource(PSASource);
  map.getView().setCenter(feature.coordinate);
  map.getView().setResolution(1.2);
  obj.feature = feature;

  dust.render('estateCards', obj, function(err, out) {
    $('.estate-cards').html(out);
    $('.mdl-card__title').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/w_432,c_scale/v1457348773/' + obj.feature.gid + '.jpg)');
    $('.estate-cards').addClass('estate-cards-active');
  // $("#infobox").addClass("visuallyhidden");
  });
  $('a[href="#openModal"]').click(function() {
    dust.render('modalInfo', obj, function(err, out) {
      $('.modal-content').html(out);
      $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/v1457348773/' + obj.feature.gid + '.jpg)');
    });
  });
  $('a[href="#closeEstateCard"]').click(function() {
    $('.estate-cards').removeClass('estate-cards-active');
  });
}
$('.info').on('change', function(e) {
  e.preventDefault();
  PSA.setSource(null);
  if ($(this).prop('checked') === true) {
    map.on('click', handleInfo);
  } else {
    map.un('click', handleInfo);
  }
});
