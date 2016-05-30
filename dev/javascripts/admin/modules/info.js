App.config.modules.info = (function info(window, document, Promise, $, App) {
  'use strict';
  var geoJSONFormat = new ol.format.GeoJSON({
    defaultDataProjection: 'EPSG:4326'
  });
  var lang = document.documentElement.lang;
  var editButton = document.querySelector('#edit');
  var infoBoxContent = document.querySelector('#infobox-content');
  var dustBluebird = App.config.promises.dustBluebird;
  var utils = App.utils;
  function dustEstateInfo(data) {
    dustBluebird.renderAsync('edit', data)
    .then(function resolveDust(result) {
      utils.removeClass(infoBoxContent, 'visuallyhidden');
      infoBoxContent.innerHTML = result;
      getmdlSelect.init('.getmdl-select');
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function selectFeature(evt) {
    var map = evt.map;
    var coordinates;
    var estate;
    var gid;
    var renderData = App.config.commons.trans;
    // var coordinate = evt.coordinate;
    var clickedFeature = map.forEachFeatureAtPixel(evt.pixel, function findFeature(feature, layer) {
      return {
        feature: feature,
        layer: layer
      };
    }, this, function clickedFeatureLayerFilter(layer) {
      if (layer.get('id') === 'estates') {
        return true;
      }
      return false;
    }, this);
    if (clickedFeature) {
      estate = clickedFeature.feature;
      coordinates = estate.getGeometry().getCoordinates();
      map.getView().setCenter(coordinates);
      map.getView().setZoom(16);
      gid = estate.getProperties().gid;
      utils.removeClass(editButton, 'mdl-button--accent');
      utils.removeClass(editButton, 'mdl-button--raised');
      var p1 = Promise.resolve(
        $.ajax({
          url: 'http://127.0.0.1:3000/api/property',
          type: 'GET',
          data: {
            gid: gid
          }
        })
      );
      p1.then(function resolve(data) {
        var feature = data.features[0];
        App.config.cache.activeEstate = feature.properties;
        return feature;
      })
      .then(function resolve(feature) {
        if (lang === 'el') {
          renderData.values = {
            gid: feature.properties.gid,
            estateType: feature.properties.estatetype,
            address: feature.properties.street_el,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            plotArea: feature.properties.plotarea,
            parcelNumber: feature.properties.parcel_num,
            parking: feature.properties.parking,
            furnished: feature.properties.furnished,
            isnew: feature.properties.isnew,
            heating: feature.properties.heating,
            cooling: feature.properties.cooling,
            view: feature.properties.view,
            title: feature.properties.title
          };
        } else {
          renderData.values = {
            gid: feature.properties.gid,
            estateType: feature.properties.estatetype_en,
            address: feature.properties.street_en,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            plotArea: feature.properties.plotarea,
            parcelNumber: feature.properties.parcel_num,
            parking: feature.properties.parking,
            furnished: feature.properties.furnished,
            isnew: feature.properties.isnew,
            heating: feature.properties.heating,
            cooling: feature.properties.cooling,
            view: feature.properties.view,
            title: feature.properties.title
          };
        }
      });
      p1.catch(function error(e) {
        console.log(e);
      });
      var p2 = Promise.resolve(
        $.ajax({
          url: 'http://127.0.0.1:3000/api/listing',
          type: 'GET',
          data: {
            gid: gid
          }
        })
      )
      .then(function resolve(data) {
        App.config.cache.activeEstateListing = data;
        renderData.listing.values = data;
        renderData.listing.exists = true;
      })
      .catch(function error(e) {
        console.log(e);

        if (e.status === 404) {
          renderData.listing.values = {};
          renderData.listing.exists = false;
        }
      });
      Promise.each([p1, p2], function e() {
      })
      .then(function resolve() {
        dustEstateInfo(renderData);
        editButton.removeAttribute('disabled');
        utils.addClass(editButton, 'mdl-button--accent');
      })
      .catch(function error(e) {
        console.log(e);
      });
    } else {
      infoBoxContent.innerHTML = '';
      utils.addClass(infoBoxContent, 'visuallyhidden');
      editButton.setAttribute('disabled', true);
      utils.removeClass(editButton, 'mdl-button--accent');
      utils.removeClass(editButton, 'mdl-button--raised');
    }
  }

  function init() {
    var map = App.config.commons.map;
    map.on('click', selectFeature);
  }
  function disable() {
    var map = App.config.commons.map;
    map.un('click', selectFeature);
  }
  return {
    init: init,
    disable: disable
  };
}(window, document, Promise, jQuery, App));
