var trans;
var userMap = (function userMap(window, document, Promise, $, mymap, info, filters) {
  'use strict';
  var context = 'map';
  var lang = document.documentElement.lang;
  // var globals = {};
  var $loading = $('.mdl-spinner');
  $(document)
  .ajaxStart(function start() {
    $('.spiner-wrapper').removeClass('visuallyhidden');
    $loading.addClass('is-active');
  })
  .ajaxStop(function stop() {
    $('.spiner-wrapper').addClass('visuallyhidden');
    $loading.removeClass('is-active');
  });
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  };

  function init() {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/language',
        type: 'GET',
        data: {
          type: lang,
          context: context
        }
      })
      )
      .then(function resolve(data) {
        var map;
        trans = data;
        map = mymap.initialize(trans);
        map1 = map;
        return map;
      })
      .then(function resolve(map) {
        info.init(map);
        filters.init(map);
      })
      .catch(function error(e) {
        console.log(e);
      });
  }

  return {
    init: init
  };
}(window, document, Promise, jQuery, mymap, info, filters));


// jQuery(document).ready(function ($) {
//   $('.spinner').addClass('visuallyhidden');
//   $('.mdl-spinner').removeClass('is-active');
//   // handleSelect();
// });

userMap.init();
$('#advanced-filters').click(function toggleFilters() {
  $('#estate-filters').toggleClass('visuallyhidden');
});
// $('#toggle-price-range').click(function togglePriceRange() {
//   $('#price-range').toggleClass('visuallyhidden');
// });
