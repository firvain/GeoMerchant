var userMap = (function userMap(window, document, Promise, $, App) {
  'use strict';
  var context = 'admin';
  var lang = document.documentElement.lang;
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
      App.config.commons.trans = data;
      App.config.commons.map = App.config.modules.map.initialize();
    })
    .then(function resolve() {
      var moduleObserver;
      App.config.modules.info.init();
      moduleObserver = new MutationObserver(function moduleObserverChooser(mutations) {
        mutations.forEach(function foerEachMutation(mutation) {
          if (typeof mutation.target.dataset !== 'undefined') {
            if (mutation.target.dataset.active === 'insert') {
              App.config.modules.insert.init();
            } else if (mutation.target.dataset.active === 'delete') {
              App.config.modules.delete.init();
            } else if (mutation.target.dataset.active === 'edit') {
              App.config.modules.edit.init();
            }
          }
        });
      });
      moduleObserver.observe(document.querySelector('body'), {
        attributes: true
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  return {
    init: init
  };
}(window, document, Promise, jQuery, App));

userMap.init();

$(function Dready() {
  var utils = App.utils;
  var addButton = document.getElementById('insert');
  var deleteButton = document.getElementById('delete');
  var editButton = document.querySelector('#edit');
  $('#logout').click(function logout() {
    location.href = '/logout';
  });
  document.getElementById('enter-fullscreen').addEventListener('click',
    function addClickEventToEnterFullsreen() {
      var elem = document.body;
      utils.requestFullScreen(elem);
      utils.removeClass(document.getElementById('exit-fullscreen').parentNode, 'visuallyhidden');
      utils.addClass(this.parentNode, 'visuallyhidden');
    }
  );
  document.getElementById('exit-fullscreen').addEventListener('click',
    function addClickEventToExitFullsreen() {
      var elem = document;
      utils.exitFullsreen(elem);
      utils.removeClass(document.getElementById('enter-fullscreen').parentNode, 'visuallyhidden');
      utils.addClass(this.parentNode, 'visuallyhidden');
    }
  );
  addButton.addEventListener('click', function activateInsertModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'insert';
  });
  deleteButton.addEventListener('click', function activateDeleteModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'delete';
  });
  editButton.addEventListener('click', function activateEditModule() {
    var body = document.querySelector('body');
    body.dataset.active = 'edit';
  });
  // console.log(bowser);
});
