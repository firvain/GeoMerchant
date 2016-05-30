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
      Promise.resolve(
        $.get('http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg')
      )
      .then(function resolveCloudinary() {
        $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg)');
      })
      .catch(function error(e) {
        if (e.status === 404) {
          $('.big-image').css('background-image', 'url(/images/no_image_available.png)');
        }
      });
    })
    .catch(function error(e) {
      console.log(e.status);
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
      Promise.resolve(
        $.get('http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg')
      )
      .then(function resolveCloudinary() {
        $('.big-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg)');
      })
      .catch(function error(e) {
        if (e.status === 404) {
          $('.big-image').css('background-image', 'url(/images/no_image_available.png)');
        }
      });
    })
    .then(function resolve() {
      $('.estate-image').css('background-image', 'url(http://res.cloudinary.com/firvain/image/upload/h_222,c_scale/' + feature.get('gid') + '.jpg)');
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
