App.config.modules.filters = (function filters(window, document, Promise, $, Parsley, moment, App) {
  'use strict';
  var lang = document.documentElement.lang;
  var dustBluebird = App.config.promises.dustBluebird;
  var utils = App.utils;

  var xy1 = ol.proj.transform([3652772, 4112808], 'EPSG:3857', 'EPSG:4326');
  var xy2 = ol.proj.transform([3700000, 4132797], 'EPSG:3857', 'EPSG:4326');
  var extent = _.concat(xy1, xy2);
  var bbox = extent;
  function assignValidators() {
    var content = document.getElementById('infobox-content');
    var inputs = content.querySelectorAll('input[type=text]');
    [].forEach.call(inputs, function makeParsleyInputs(el) {
      el.addEventListener('blur', function sanitize() {
        var str = this.value;
        var sanitizedStr;
        if (this.dataset.type === 'number') {
          sanitizedStr = str.replace(/[/\D/ ]/gi, '');
        } else if (this.dataset.type === 'alphanum') {
          sanitizedStr = str.replace(/[^a-z0-9A-ZA-zΑ-Ωα-ωίϊΐόάέύϋΰήώ ]/gi, '');
        } else if (this.dataset.type === 'special') {
          sanitizedStr = str.replace(/[^0-9 \/]/gi, '');
        } else if (this.dataset.type === 'date') {
          sanitizedStr = str.replace(/[^0-9 \-]/gi, '');
        }
        this.value = sanitizedStr;
        utils.removeClass(this.parentNode, 'is-invalid');
      });
    });
  }
  function addResults(data) {
    var map = App.config.commons.map;
    var geoJSONFormat = new ol.format.GeoJSON({
      defaultDataProjection: 'EPSG:4326'
    });
    var features = geoJSONFormat.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
    features.forEach(function setId(f) {
      f.setId(f.getProperties().gid);
    });
    utils.findById(map, 'filteredEstates').getSource().addFeatures(features);
    if (lang === 'el') {
      toastr.info('Βρέθηκαν ' + features.length + ' ιδιοκτησίες!');
    } else {
      toastr.info('Found ' + features.length + ' estates!');
    }
  }
  function clearResults() {
    var map = App.config.commons.map;
    utils.findById(map, 'filteredEstates').getSource().clear();
    utils.findById(map, 'select').getSource().clear();
    map.getInteractions().forEach(function findInteractionById(i) {
      if (i.getProperties().id === 'draw') {
        i.setActive(false);
      }
    });
    $(map.getViewport()).off('mouseleave');
    $(map.getViewport()).off('mouseenter');
    bbox = extent;
    utils.findById(map, 'estates').setVisible(true);
    App.config.modules.info.init();
    $('#results').addClass('visuallyhidden').removeAttr('style')
    .empty();
  }
  function setOptions() {
    var filterData = {};
    filterData.estateType = $('#estateType').val();
    filterData.leaseType = $('input[name=options]:checked').val() !== undefined ? $('input[name=options]:checked').val() : 'Rent';
    filterData.startPrice = $('#startPrice').val() !== '' ? $('#startPrice').val() : 0;
    filterData.endPrice = $('#endPrice').val() !== '' ? $('#endPrice').val() : 2147483647;
    filterData.areaStart = $('#area-start').val() !== '' ? $('#area-start').val() : 0;
    filterData.areaEnd = $('#area-end').val() !== '' ? $('#area-end').val() : 2147483647;
    filterData.parking = $('#checkbox-1').prop('checked') !== undefined ? $('#checkbox-1').prop('checked') : false;
    filterData.furnished = $('#checkbox-2').prop('checked') !== undefined ? $('#checkbox-2').prop('checked') : false;
    filterData.heating = $('#checkbox-3').prop('checked') !== undefined ? $('#checkbox-3').prop('checked') : false;
    filterData.cooling = $('#checkbox-4').prop('checked') !== undefined ? $('#checkbox-4').prop('checked') : false;
    filterData.view = $('#checkbox-5').prop('checked') !== undefined ? $('#checkbox-5').prop('checked') : false;
    filterData.bbox = bbox;
    return filterData;
  }
  function getResults(options) {
    var map = App.config.commons.map;
    var trans = _.cloneDeep(App.config.commons.trans);
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing/filters',
        type: 'GET',
        dataType: 'json',
        data: options
      })
    )
    .then(function resolve(data) {
      var renderData = {};
      var results = [];

      utils.findById(map, 'estates').setVisible(false);
      utils.findById(map, 'poi').getSource().clear();
      utils.findById(map, 'filteredEstates').getSource().clear();
      // utils.findById(map, 'select').getSource().clear();
      addResults(data);
      _.forEach(data.features, function(value) {
        var address;
        var dateStart;
        var dateEnd;
        var coordinates = ol.proj.transform(value.geometry.coordinates, 'EPSG:3857', 'EPSG:4326');
        if (lang === 'el') {
          address = value.properties.street_el + ' ' + value.properties.street_number;
          dateStart = moment(value.properties.date_start).format('DD-MM-YYYY');
          dateEnd = moment(value.properties.end).format('DD-MM-YYYY');
        } else {
          address = value.properties.street_en + ' ' + value.properties.street_number;
          dateStart = moment(value.properties.date_start).format('MM-DD-YYYY');
          dateEnd = moment(value.properties.end).format('MM-DD-YYYY');
        }
        results.push({
          gid: value.properties.gid,
          price: value.properties.price,
          area: value.properties.estatearea,
          address: address,
          dateStart: dateStart,
          dateEnd: dateEnd,
          title: {
            price: trans.listing.price,
            area: trans.estate.area,
            areaUnits: trans.estate.areaUnits
          },
          coordinates: coordinates
        });
      });
      renderData.results = results;
      return renderData;
    })
    .then(function resolve(data) {
      dustBluebird.renderAsync('results', data)
      .then(function resolveDust(result) {
        var results = document.getElementById('results');
        utils.removeClass(results, 'visuallyhidden');
        results.innerHTML = result;
      })
      .then(function resolvez() {
        var zooms = document.getElementById('contentArea').querySelectorAll('i');
        zooms.forEach(function addZoomToResults(zoom) {
          zoom.addEventListener('click', function zoomToGid() {
            var gid = zoom.parentNode.parentNode.parentNode.dataset.gid;
            var coordinates = utils.findById(map, 'filteredEstates').getSource().getFeatureById(gid)
            .getGeometry()
            .getCoordinates();
            map.getView().setCenter(coordinates);
            map.getView().setZoom(16);
          });
        });
      });
    })
    .then(function resolve() {
      var clusterize = new Clusterize({
        scrollId: 'scrollArea',
        contentId: 'contentArea'
      });
    })
    .catch(function error(e) {
      console.log(e);
      if (e.status === 404) {
        toastr.error(trans.errors.property[404]);
      } else if (e.status === 503) {
        toastr.error(trans.errors.property[503]);
      } else {
        toastr.error(trans.errors.internal);
      }
    });
  }
  function chooseByArea(draw) {
    var map = App.config.commons.map;
    $(map.getViewport()).mouseleave(function leaveMapForAreaSelection(event) {
      event.preventDefault();
      event.stopPropagation();
      draw.setActive(false);
    });
    $(map.getViewport()).mouseenter(function enterMapForAreaSelection(event) {
      event.preventDefault();
      event.stopPropagation();
      draw.setActive(true);
    });
    draw.on('drawstart', function drawstart() {
      utils.findById(map, 'select').getSource().clear();
    });
    draw.on('drawend', function drawend(e) {
      var coordinates = e.feature.getGeometry().getExtent();
      var transformedCoordinates = _.chunk(coordinates, 2).map(function split(currentValue) {
        return ol.proj.transform(currentValue, 'EPSG:3857', 'EPSG:4326');
      });
      bbox = _.concat(transformedCoordinates[0], transformedCoordinates[1]);
    });
  }
  function init() {
    var map = App.config.commons.map;
    var drawInteraction = new ol.interaction.Draw({
      source: utils.findById(map, 'select').getSource(),
      type: 'LineString',
      geometryFunction: utils.geometryFunction,
      maxPoints: 2
      // condition: function(event) {
      //   return ol.events.condition.platformModifierKeyOnly(event);
      // }
    });
    drawInteraction.setProperties({
      id: 'draw'
    });
    drawInteraction.setActive(false);
    $('#checkbox-6').change(function enableAreaSelection() {
      if (this.checked) {
        map.addInteraction(drawInteraction);
        App.config.modules.info.disable();
        chooseByArea(drawInteraction);
      } else {
        App.config.modules.info.init();
        map.removeInteraction(drawInteraction);
        drawInteraction.setActive(false);
        utils.findById(map, 'select').getSource().clear();
        bbox = extent;
      }
    });
    assignValidators();
    $('#invokeFilters').click(function invokeFilters(event) {
      var options;
      event.preventDefault();
      event.stopPropagation();
      options = setOptions();
      if ($('form[name=filters]').parsley().validate()) {
        getResults(options);
      }
    });
    $('#clearFilters').click(function clearFilters(event) {
      event.preventDefault();
      event.stopPropagation();
      clearResults(map);
      $('label[for=option-1]').addClass('is-checked');
      $('#option-1').prop('checked', true);
      $('label[for=option-2]').removeClass('is-checked');
      $('#option-2').prop('checked', false);
      $('.mdl-checkbox__input').each(function clearCheckboxes(index, el) {
        $(el).prop('checked', false).parent('label')
        .removeClass('is-checked');
      });
      $('.mdl-textfield__input').each(function clearInputs(index, el) {
        if ($(el).attr('id') !== 'estateType') {
          $(el).val('').parent()
          .eq(0)
          .removeClass('is-dirty');
        } else {
          $(el).attr('data-val', 'Apartment');
          if (lang === 'el') {
            $(el).val('Διαμέρισμα');
          } else {
            $('#estateType').val('Apartment');
          }
        }
      });
    });
  }
  return {
    init: init
  };
}(window, document, Promise, $, Parsley, moment, App));
