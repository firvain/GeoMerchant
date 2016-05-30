App.config.modules.edit = (function edit(window, document, Promise, $, dPick, moment) {
  'use strict';
  var editButton = document.querySelector('#edit');
  var infoBoxContent = document.querySelector('#infobox-content');
  var lang = document.documentElement.lang;
  var map = App.config.commons.map;
  var info = App.config.modules.info;
  var utils = App.utils;
  function datePicker() {
    var format = (lang === 'el') ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    var dateStartPicker;
    var dateEndPicker;
    var dateStart = document.getElementById('listing-date--start__toggle');
    var dateEnd = document.getElementById('listing-date--end__toggle');
    var dateStartInput = document.getElementById('listing-date--start');
    var dateEndInput = document.getElementById('listing-date--end');
    var observeDatePicker = new MutationObserver(function observeDatePicker(mutations) {
      var attributeValue;
      mutations.forEach(function foerEachMutation(mutation) {
        if (mutation.attributeName === 'class') {
          attributeValue = $(mutation.target).prop(mutation.attributeName);
          if (attributeValue.indexOf('mddtp-picker--inactive') > -1) {
            info.init();
          } else {
            info.disable();
          }
        }
      });
    });

    if (dateStartInput !== null) {
      dateStartPicker = new dPick.default({
        type: 'date',
        init: moment(dateStartInput.value, format),
        future: moment().add(5, 'years'),
        trigger: dateStartInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateStartInput.addEventListener('onOk', function displayPickedate() {
        this.value = dateStartPicker.time.format(format).toString();
      });
      dateStart.addEventListener('click', function showDatePicker(e) {
        dateStartPicker.toggle();
      });
    }
    if (dateEndInput !== null) {
      dateEndInput.addEventListener('onOk', function displayPickedate() {
        this.value = dateEndPicker.time.format(format).toString();
      });
      dateEndPicker = new dPick.default({
        type: 'date',
        init: moment(dateEndInput.value, format),
        future: moment().add(5, 'years'),
        trigger: dateEndInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateEnd.addEventListener('click', function showDatePicker(e) {
        dateEndPicker.toggle();
      });
    }
  }
  function enableEdit() {
    var inputs = infoBoxContent.querySelectorAll('input');
    var labels = infoBoxContent.querySelectorAll('label');
    var buttons = infoBoxContent.querySelectorAll('button');
    var editCloseButton = document.querySelector('.close');
    [].forEach.call(inputs, function removeDisabledInputs(el) {
      if (!utils.hasClass(el, 'not-edditable')) {
        el.removeAttribute('disabled');
      }
    });
    [].forEach.call(labels, function removeDisabledLabels(el) {
      utils.removeClass(el, 'is-disabled');
    });
    [].forEach.call(buttons, function removeDisabledLabels(el) {
      el.removeAttribute('disabled');
    });
    utils.addClass(editButton, 'mdl-button--raised');
    utils.removeClass(document.querySelector('#edit-actions'), 'visuallyhidden');
    editCloseButton.addEventListener('click', function cancelEdit() {
      infoBoxContent.innerHTML = '';
      utils.addClass(infoBoxContent, 'visuallyhidden');
      editButton.setAttribute('disabled', true);
      utils.removeClass(editButton, 'mdl-button--accent');
      utils.removeClass(editButton, 'mdl-button--raised');
    });
    datePicker();
  }

  function init() {
    editButton.addEventListener('click', function addClickEventToEditButton() {
      enableEdit();
    });
  }

  return {
    init: init
  };
}(window, document, Promise, $, mdDateTimePicker, moment, App));
