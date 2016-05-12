var filters = (function filters(window, document, Promise, $, utils, Parsley) {
  'use strict';

  function setOptions() {
    var filterData = {};
    filterData.estateType = $('#estateType').val();
    filterData.leaseType = $('input[name=options]:checked').val() !== undefined ? $('input[name=options]:checked').val() : 'Rent';
    filterData.startPrice = $('#startPrice').val() !== '' ? $('#startPrice').val() : 0;
    filterData.endPrice = $('#endPrice').val() !== '' ? $('#endPrice').val() : 2147483647;
    filterData.parking = $('#checkbox-1').prop('checked') !== undefined ? $('#checkbox-1').prop('checked') : false;
    filterData.furnished = $('#checkbox-2').prop('checked') !== undefined ? $('#checkbox-2').prop('checked') : false;
    filterData.heating = $('#checkbox-3').prop('checked') !== undefined ? $('#checkbox-3').prop('checked') : false;
    filterData.cooling = $('#checkbox-4').prop('checked') !== undefined ? $('#checkbox-4').prop('checked') : false;
    filterData.view = $('#checkbox-5').prop('checked') !== undefined ? $('#checkbox-5').prop('checked') : false;
    return filterData;
  }
  function getResults(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/db/listed/filters',
        type: 'GET',
        dataType: 'json',
        data: data
      })
    )
    .then(function resolve(data) {
      console.log(data);
    });
  }
  function init() {
    $('#invokeFilters').click(function invokeFilters(event) {
      var options;
      event.preventDefault();
      event.stopPropagation();
      options = setOptions();
      console.log(options);
      if ($('form[name=filters]').parsley().validate()) {
        getResults(options);
      }
    });
  }
  return {
    init: init
  };
}(window, document, Promise, $, utils, Parsley));
