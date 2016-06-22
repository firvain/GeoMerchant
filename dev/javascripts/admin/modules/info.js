App.config.modules.info = (function info(window, document, Promise, $, App) {
  'use strict';
  var lang = document.documentElement.lang;
  var editButton = document.querySelector('#edit');
  var deleteButton = document.querySelector('#delete');
  var infoBoxContent = document.querySelector('#appwrapper__infobox-content');
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
    var renderData = _.cloneDeep(App.config.commons.trans);
    var style = new ol.style.Style({
      image: new ol.style.Icon(({
        src: './images/pins/generic-48.png',
        anchorOrigin: 'bottom-left',
        anchor: [0.5, 0],
        scale: 1,
        color: 'rgb(255,82,82)'
      }))
    });
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
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      estate = clickedFeature.feature;
      coordinates = estate.getGeometry().getCoordinates();
      map.getView().setCenter(coordinates);
      map.getView().setZoom(16);
      gid = estate.getProperties().gid;
      estate.setStyle(style);
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
            x: coordinates[0],
            y: coordinates[1],
            areaName: feature.properties.area_name,
            estateType: feature.properties.estatetype,
            address: feature.properties.street_el,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            planNumber: feature.properties.plan_num,
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
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1],
            areaName: feature.properties.area_name,
            estateType: feature.properties.estatetype_en,
            address: feature.properties.street_en,
            addressNumber: feature.properties.street_number,
            pscode: feature.properties.ps_code,
            estateArea: feature.properties.estatearea,
            bedrooms: feature.properties.bedrooms,
            floor: feature.properties.floor,
            year: feature.properties.year,
            planNumber: feature.properties.plan_num,
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
        renderData.listing.values.date_start = utils.handleDate(data.date_start, lang);
        renderData.listing.values.date_end = utils.handleDate(data.date_end, lang);
        renderData.listing.exists = true;
      })
      .catch(function error(e) {
        var snackbarContainer = document.querySelector('#appwrapper__snackbar');
        var data = { message: App.config.commons.trans.errors.listing404 };
        console.log(e);
        if (e.status === 404) {
          renderData.listing.exists = false;
          snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
      });
      Promise.each([p1, p2], function e(result) {
      })
      .then(function resolve() {
        dustEstateInfo(renderData);
        editButton.removeAttribute('disabled');
        deleteButton.removeAttribute('disabled');

        utils.addClass(editButton, 'mdl-button--accent');
        utils.addClass(deleteButton, 'mdl-button--accent');
      })
      .catch(function error(e) {
        console.log(e);
      });
    } else {
      infoBoxContent.innerHTML = '';
      utils.addClass(infoBoxContent, 'visuallyhidden');
      editButton.setAttribute('disabled', true);

      deleteButton.setAttribute('disabled', true);

      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    }
  }

  function init() {
    var map = App.config.commons.map;
    document.querySelector('body').dataset.active = 'info';
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
