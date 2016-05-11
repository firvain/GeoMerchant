var info = (function info(window, document, Promise, $, utils) {
  'use strict';
  var geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326'
  });
  function extraInfoModal(feature) {
    var modalPromise;
    var obj = {};
    if (feature.get('rent')) {
      obj.listing_type = trans.listing.rent;
    } else {
      obj.listing_type = trans.listing.sale;
    }
    obj.type = feature.get('estatetype');
    obj.gid = feature.get('gid');
    if (trans.lang === 'el') {
      obj.address = feature.get('street_el') + '' +  feature.get('street_number');
      obj.contact = {
        name: feature.getProperties().name_el,
        lastname: feature.getProperties().lastname_el
      };
    } else {
      obj.address = feature.get('street_en') + '' +  feature.get('street_number');
      obj.contact = {
        name: feature.getProperties().name_en,
        lastname: feature.getProperties().lastname_en
      };
    }
    obj.area = feature.get('estatearea');
    obj.bedrooms = feature.get('bedrooms');
    obj.price = feature.get('price');
    obj.title = {
      gid: trans.estate.gid,
      listing_type: trans.listing.type,
      address: trans.estate.address,
      area: trans.estate.area,
      bedrooms: trans.estate.amenities.bedrooms,
      price: trans.listing.price,
      isnew: trans.estate.amenities.isnew,
      parking: trans.estate.amenities.parking,
      furnished: trans.estate.amenities.furnished,
      pets: trans.estate.amenities.pets,
      view: trans.estate.amenities.view,
      heating: trans.estate.amenities.heating,
      cooling: trans.estate.amenities.cooling,
      contactInfo: trans.contact.contactInfo,
      name: trans.contact.name,
      lastname: trans.contact.lastname,
      phone: trans.contact.phone,
      email: trans.contact.email
    };
    obj.isnew = feature.get('isnew');
    obj.furnished = feature.get('furnished');
    obj.pets = feature.get('pets');
    obj.btns = {
      info: trans.btns.info,
      close: trans.btns.close
    };
    if (feature.getProperties().phone2 !== null) {
      obj.contact.phone = feature.getProperties().phone1 + ' ' + feature.getProperties().phone2;
    } else {
      obj.contact.phone = feature.getProperties().phone1;
    }
    obj.contact.email = feature.getProperties().email;

    modalPromise = dustBluebird.renderAsync('modalInfo', obj)
    .then(function resolve(data) {
      $('#modal').removeClass('visuallyhidden');
      $('.modal-content').html(data);
    })
    .then(function resolve() {
      $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg)');
      console.log(feature);
    })
    .catch(function error(e) {
      console.log(e);
    });
    $('#modal-close').click(function closeModal() {
      $('#modal').addClass('visuallyhidden');
    });
  }
  function renderEstateCards(feature) {
    var estateCardsPromise;
    var obj = {};
    if (feature.get('rent')) {
      obj.listing_type = trans.listing.rent;
    } else {
      obj.listing_type = trans.listing.sale;
    }
    obj.type = feature.get('estatetype');
    obj.gid = feature.get('gid');
    if (trans.lang === 'el') {
      obj.address = feature.get('street_el') + '' +  feature.get('street_number');
    } else {
      obj.address = feature.get('street_en') + '' +  feature.get('street_number');
    }
    obj.area = feature.get('estatearea');
    obj.bedrooms = feature.get('bedrooms');
    obj.price = feature.get('price');
    obj.title = {
      listing_type: trans.listing.type,
      address: trans.estate.address,
      area: trans.estate.area,
      bedrooms: trans.estate.amenities.bedrooms,
      price: trans.listing.price,
      isnew: trans.estate.amenities.isnew,
      furnished: trans.estate.amenities.furnished,
      pets: trans.estate.amenities.pets
    };
    obj.isnew = feature.get('isnew');
    obj.furnished = feature.get('furnished');
    obj.pets = feature.get('pets');
    obj.btns = {
      info: trans.btns.info,
      close: trans.btns.close
    };
    estateCardsPromise = dustBluebird.renderAsync('estateCards', obj)
    .then(function resolve(data) {
      $('.estate-cards').html(data);
    })
    .then(function resolve() {
      $('.mdl-card__title').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/w_432,c_scale/' + obj.gid + '.jpg)');
      $('.estate-cards').addClass('estate-cards-active');
      $('#estate-card-square-close').click(function close() {
        $('.estate-cards').removeClass('estate-cards-active');
      });
      $('#estate-card-square-extra-info').click(function extraInfo() {
        extraInfoModal(feature);
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function selectFeature(evt) {
    var map = evt.map;
    // var coordinate = evt.coordinate;
    var f;
    var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function findFeature(feature, layer) {
      return {
        feature: feature,
        layer: layer
      };
    }, this, function clickedFeatureLayerFilter(layer) {
      if (layer.get('id') === 'estates' || layer.get('id') === 'filteredEstates') {
        return true;
      }
      return false;
    }, this);
    if (clickedFeature) {
      if (clickedFeature.layer.get('id') === 'estates' &&
        clickedFeature.feature.get('features').length === 1) {
        f = clickedFeature.feature.getProperties().features[0];
        renderEstateCards(f);
        map.getView().setCenter(f.getGeometry().getCoordinates());
        map.getView().setZoom(16);
        Promise.resolve(
          $.ajax({
            url: 'http://127.0.0.1:3000/db/uses/' + f.getProperties().gid,
            type: 'GET',
            dataType: 'json'
          })
        )
        .then(function resolve(data) {
          var features;
          utils.findById(map, 'poi').getSource().clear();
          features = geoJSONFormat.readFeatures(data.property_services_analysis, {
            featureProjection: 'EPSG:3857'
          });
          features.forEach(function removePolygon(feature) {
            if (feature.getGeometry().getType() === 'Polygon') {
              features.splice(features.indexOf(feature), 1);
            }
          });
          utils.findById(map, 'poi').getSource().addFeatures(features);
          // map.getView().fit(utils.findById(map, 'poi').getSource().getExtent(), map.getSize());

          toastr.info('Found ' + features.length + ' Points of Interest in 8 minute distance!');
        })
        .catch(function error(e) {
          utils.findById(map, 'poi').getSource().clear();
          if (e.status === 404) {
            toastr.error('Sorry, we cannot find any Points of Interest in 8 minute distance!');
          } else {
            console.log(e);
            toastr.error(e.responseText);
          }
        });
      } else if (clickedFeature.layer.get('id') === 'filteredEstates') {
        f = clickedFeature.feature;
        renderEstateCards(f);
        Promise.resolve(
          $.ajax({
            url: 'http://127.0.0.1:3000/db/uses/' + f.getProperties().gid,
            type: 'GET',
            dataType: 'json'
          })
        )
        .then(function resolve(data) {
          var features;
          if (utils.findById(map, 'poi').getSource().getFeatures().length !== 0) {
            utils.findById(map, 'poi').getSource().clear();
          }
          features = geoJSONFormat.readFeatures(data.property_services_analysis, {
            featureProjection: 'EPSG:3857'
          });
          features.forEach(function removePolygon(feature) {
            if (feature.getGeometry().getType() === 'Polygon') {
              features.splice(features.indexOf(feature), 1);
            }
          });
          utils.findById(map, 'poi').getSource().addFeatures(features);
          map.getView().fit(utils.findById(map, 'poi').getSource().getExtent(), map.getSize());
          toastr.info('Found ' + features.length + ' Points of Interest in 8 minute distance!');
          console.log(trans);
        })
        .catch(function error(e) {
          if (e.status === 404) {
            toastr.error('Sorry, we cannot find any Points of Interest in 8 minute distance!');
          } else {
            console.log(e);
            toastr.error(e.responseText);
          }
        });
      }
    } else {
      utils.findById(map, 'poi').getSource().clear();
    }
  }

  function init(map) {
    map.on('click', selectFeature);
  }
  function disable(map) {
    map.un('click', selectFeature);
  }
  return {
    init: init,
    disable: disable
  };
}(window, document, Promise, jQuery, utils));


// function handleInfo(evt) {
//   var coordinate = evt.coordinate;
//   var obj = {};
//   var title = {};
//   var owner = {};
//   var features = [];
//   var clickedFeature;
//   var f;

//   map.removeInteraction(draw);
//   evt.preventDefault();
//   obj.title = title;
//   if (lang === 'el') {
//     title.gid = 'Κωδικός Ιδιοκτησίας';
//     title.type = 'Είδος Ιδιοκτησίας';
//     title.listing_type = 'Τύπος Αγγελίας';
//     title.area = 'Εμβαδό';
//     title.address = 'Διευθυνση';
//     title.bedrooms = 'Υπνοδωμάτια';
//     title.price = 'Τιμή';
//     title.isnew = 'Νεόδμητο';
//     title.parking = 'Στάθμεση';
//     title.furnished = 'Επιπλωμένο';
//     title.pets = 'Κατοικίδια';
//     title.view = 'Θέα';
//     title.heating = 'Θέρμανση';
//     title.cooling = 'Ψύξη';
//     title.contactInfo = 'Στοιχεία Επικοινωνίας';
//     title.name = 'Όνομα';
//     title.lastname = 'Επίθετο';
//     title.phone = 'Τηλέφωνο';
//     title.email = 'Ηλεκτρονική Διεύθυνση';
//   } else {
//     title.gid = 'Estate Code';
//     title.type = 'Property Type';
//     title.listing_type = 'Listing Type';
//     title.area = 'Size';
//     title.address = 'Address';
//     title.bedrooms = 'Bedrooms';
//     title.price = 'Price';
//     title.isnew = 'Newly Build';
//     title.parking = 'Parking';
//     title.furnished = 'Furnished';
//     title.pets = 'Pets Allowed';
//     title.view = 'View';
//     title.heating = 'Heating';
//     title.cooling = 'Cooling';
//     title.contactInfo = 'Contact Info';
//     title.name = 'Name';
//     title.lastname = 'Last Name';
//     title.phone = 'Telephone';
//     title.email = 'Email';
//   }
//   clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
//     return {
//       feature: feature,
//       layer: layer
//     };
//   }, this, function (layer) {
//     if (layer.get('id') === 'estates' || layer.get('id') === 'filteredEstates') {
//       return true;
//     }
//     return false;
//   }, this);
//   if (clickedFeature) {
//     if (clickedFeature.layer.get('id') === 'estates' && clickedFeature.feature.get('features').length === 1) {
//       f = clickedFeature.feature.getProperties().features[0];
//       createPSAandCard(f, obj);
//     } else if (clickedFeature.layer.get('id') === 'filteredEstates') {
//       f = clickedFeature.feature;
//       createPSAandCard(f, obj);
//     }
//   } else {
//     PSA.setSource(null);
//   }
// }

// function createPSAandCard(f, obj) {
//   var feature = {};
  // feature.gid = f.get('gid');
  // feature.area = f.get('estatearea');
//   if (lang === 'el') {
//     feature.type = f.get('estatetype');
//     feature.address = f.get('street_el') + ' ' + f.get('street_number');
//     feature.name = f.get('name_el');
//     feature.lastname = f.get('lastname_el');
//     if (f.get('sale') === true) {
//       feature.listing_type = 'Πώληση';
//     } else {
//       feature.listing_type = 'Ενοικίαση';
//     }
//     feature.btns = {
//       info: 'πληροφοριες',
//       close: 'κλεισιμο'
//     };
//   } else {
//     feature.type = f.get('estatetype_en');
//     feature.address = f.get('street_en') + ' ' + f.get('street_number');
//     feature.name = f.get('name_en');
//     feature.lastname = f.get('lastname_en');
//     if (f.get('sale') === true) {
//       feature.listing_type = 'Sale';
//     } else {
//       feature.listing_type = 'Rent';
//     }
//     feature.btns = {
//       info: 'info',
//       close: 'close'
//     };
//   }
//   feature.bedrooms = f.get('bedrooms');
//   feature.price = f.get('price');
//   feature.isnew = f.get('isnew');
//   feature.parking = f.get('parking');
//   feature.furnished = f.get('furnished');
//   feature.pets = f.get('pets');
//   feature.view = f.get('view');
//   feature.heating = f.get('heating');
//   feature.cooling = f.get('cooling');
//   feature.phone = f.get('phone1');
//   feature.email = f.get('email');
//   feature.coordinate = f.get('geometry').getCoordinates();

//   var PSASource = new ol.source.Vector({
//     attributions: [new ol.Attribution({
//       html: 'POI by ' + '<a href="http://www.terracognita.gr/">Terra Cognita</a>'
//     })],
//     format: geoJSONFormat,
//     loader: function (extent, resolution, projection) {
//       var url = 'http://127.0.0.1:3000/db/uses/' + feature.gid;
//       var self = this;
//       $.ajax({
//         url: url,
//         type: 'GET',
//         dataType: 'json'
//       }).done(function succeded(data, textStatus, jqXHR) {
        // var features = geoJSONFormat.readFeatures(data.property_services_analysis, {
        //   featureProjection: 'EPSG:3857'
        // });
        // var featuresLength = features.length - 1;
        // var area = new ol.style.Style({
        //   fill: new ol.style.Fill({
        //     color: [156, 39, 176, 0.1]
        //   })
        // });
        // features[0].setStyle(area);
        // self.addFeatures(features);
//         toastr.clear();
//         toastr.info('Found ' + featuresLength + ' Points of Interest in 8 minute distance!');
//       }).fail(function failed(jqXHR) {
//         toastr.clear();
//         if (jqXHR.status === 404) {
//           toastr.error('Sorry, we cannot find any Points of Interest in 8 minute distance!');
//         } else if (jqXHR.status === 503) {
//           toastr.error('Service Unavailable');
//         } else {
//           toastr.error('Internal Server Error');
//         }
//       });
//     },
//     strategy: ol.loadingstrategy.all
//   });
//   PSA.setSource(PSASource);
//   map.getView().setCenter(feature.coordinate);
//   map.getView().setResolution(1.2);
//   obj.feature = feature;

//   dust.render('estateCards', obj, function renderEstateCards(err, out) {
//     $('.estate-cards').html(out);
//     $('.mdl-card__title').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/w_432,c_scale/' + obj.feature.gid + '.jpg)');
//     $('.estate-cards').addClass('estate-cards-active');
//   // $("#infobox").addClass("visuallyhidden");
//   });
//   $('a[href="#openModal"]').click(function () {
//     dust.render('modalInfo', obj, function renderModalInfo(err, out) {
//       $('.modal-content').html(out);
//       $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + obj.feature.gid + '.jpg)');
//     });
//   });
//   $('a[href="#closeEstateCard"]').click(function () {
//     $('.estate-cards').removeClass('estate-cards-active');
//   });
// }
// $('#information').on('click', function (e) {
//   // PSA.setSource(null);
//   if ($(this).prop('checked') === true) {
//     map.on('click', selectedFeature);
//     // $(this).parent().siblings().find('input').each(function () {$(this).prop('disabled', true);});
//   } else {
//     map.un('click', selectedFeature);
//     // $(this).parent().siblings().find('input').each(function () {$(this).prop('disabled', false);});
//   }
// });
