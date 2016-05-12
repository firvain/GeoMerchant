var filters = (function filters(window, document, Promise, $, utils, Parsley) {
  'use strict';
  function addResults(data, map) {
    var geoJSONFormat = new ol.format.GeoJSON({
      defaultDataProjection: 'EPSG:4326'
    });
    var features = geoJSONFormat.readFeatures(data, {
      featureProjection: 'EPSG:3857'
    });
    utils.findById(map, 'filteredEstates').getSource().addFeatures(features);
    if (trans.lang === 'el') {
      toastr.info('Βρέθηκαν ' + features.length + ' ιδιοκτησίες!');
    } else {
      toastr.info('Found ' + features.length + ' estates!');
    }
  }
  function clearResults(map) {
    utils.findById(map, 'filteredEstates').getSource().clear();
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
    return filterData;
  }
  function getResults(options, map) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/db/listed/filters',
        type: 'GET',
        dataType: 'json',
        data: options
      })
    )
    .then(function resolve(data) {
      utils.findById(map, 'estates').setVisible(false);
      utils.findById(map, 'poi').getSource().clear();
      clearResults(map);
      addResults(data, map);
    }).catch(function error(e) {
      if (e.status === 404) {
        toastr.error(trans.errors.property[404]);
      } else if (e.status === 503) {
        toastr.error(trans.errors.property[503]);
      } else {
        toastr.error(trans.errors.internal);
      }
    });
  }
  function init(map) {
    $('#invokeFilters').click(function invokeFilters(event) {
      var options;
      event.preventDefault();
      event.stopPropagation();
      options = setOptions();
      if ($('form[name=filters]').parsley().validate()) {
        getResults(options, map);
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
          if (trans.lang === 'el') {
            $(el).val('Διαμέρισμα');
          } else {
            $('#estateType').val('Apartment');
          }
        }
      });
      utils.findById(map, 'estates').setVisible(true);
    });
  }
  return {
    init: init
  };
}(window, document, Promise, $, utils, Parsley));
