App.config.modules.edit = (function edit(window, document, Promise, $, dPick, moment) {
  'use strict';
  var content = document.querySelector('#appwrapper__infobox-content');
  var lang = document.documentElement.lang;
  var info = App.config.modules.info;
  var utils = App.utils;
  var editButton = document.querySelector('#edit');
  var deleteButton = document.querySelector('#delete');
  var body = document.querySelector('body');
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
    }
  }
  function getInteraction(id) {
    var map = App.config.commons.map;
    var interactions = map.getInteractions();
    var found = {};
    interactions.forEach(function getInteractionId(interaction) {
      if (interaction.get('id') === id) {
        found = interaction;
        return false;
      }
      return true;
    });
    return found;
  }
  function assignValidators() {
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

  function setEstateType(type) {
    var types;
    if (lang === 'el') {
      types = {
        Διαμέρισμα: function getApartment() {
          return 'Apartment';
        },
        Μονοκατοικία: function getDetachedHouse() {
          return 'Detached House';
        },
        Μεζονέτα: function getMaisonette() {
          return 'Maisonette';
        },
        Έπαυλη: function getVilla() {
          return 'Villa';
        }
      };
    } else {
      types = {
        Apartment: function getApartment() {
          return 'Διαμέρισμα';
        },
        'Detached House': function getDetachedHouse() {
          return 'Μονοκατοικία';
        },
        Maisonette: function getMaisonette() {
          return 'Μεζονέτα';
        },
        Villa: function getVilla() {
          return 'Έπαυλη';
        }
      };
    }
    return types[type]();
  }
  function collectValues() {
    var values = {};
    var filteredValues = {};
    var inputs = content.querySelectorAll('input[type=text]');
    var checkboxes = content.querySelectorAll('input[type=checkbox]');
    values.estate = {};
    values.listing = {};

    [].forEach.call(inputs, function collectFromInputs(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.value;
      var newX = document.querySelector('#estate').dataset.newx;
      var newY = document.querySelector('#estate').dataset.newy;
      var originalX = document.querySelector('#estate').dataset.originalx;
      var originalY = document.querySelector('#estate').dataset.originaly;

      if (el.getAttribute('id').indexOf('estate') > -1) {
        if (typeof newX !== 'undefined') {
          values.estate.x = newX;
          values.estate.y = newY;
        } else {
          values.estate.x = originalX;
          values.estate.y = originalY;
        }
        if (lang === 'el') {
          if (name === 'type') {
            values.estate.estatetypeEn = setEstateType(value);
            values.estate.estatetype = value;
          }
          if (name === 'address') {
            values.estate.streetEn = utils.elToEn(value);
            values.estate.streetEl = value;
          }
        } else {
          if (name === 'type') {
            values.estate.estatetypeEn = value;
            values.estate.estatetype = setEstateType(value);
          }
          if (name === 'address') {
            values.estate.streetEn = value;
            values.estate.streetEl = utils.elToEn(value);
          }
        }
        if (name === 'addressNumber') {
          values.estate.streetNumber = value;
        }
        values.estate[name] = value;
      } else {
        if (name === 'type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        } else {
          values.listing[name] = value;
        }
      }
    });
    [].forEach.call(checkboxes, function collectFromCheckboxes(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.checked;
      if (name !== 'pets') {
        values.estate[name] = value;
      } else {
        values.listing[name] = value;
      }
    });
    filteredValues.estate = _.omit(values.estate, ['address', 'addressNumber', 'type', 'toggle']);
    filteredValues.listing = values.listing;
    return filteredValues;
  }
  function update(data) {
    var snackbarContainer = document.querySelector('#appwrapper__snackbar');
    var msgData = {};
    function addGidToListing(input, gid) {
      var returnedData = input;
      returnedData.gid = gid;
      return returnedData;
    }
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'PUT',
        data: data.estate
      })
      )
    .then(function resolve(estateResult) {
      msgData.estateId = estateResult.propertyGid;
      if (!_.isEmpty(data.listing)) {
        return $.ajax({
          url: 'http://127.0.0.1:3000/api/listing',
          type: 'PUT',
          data: addGidToListing(data.listing, estateResult.propertyGid)
        });
      }
      return null;
    })
    .then(function resolve(listingResult) {
      var msg;
      // console.log(result)
      if (listingResult === null) {
        msg = { message: 'Updated Estate: ' + msgData.estateId };
      } else {
        msg = { message: 'Updated EstateID: ' + msgData.estateId + ' and ListingID: ' + listingResult.listingId };
      }
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    })
    .finally(function closeUpdate() {
      var map = App.config.commons.map;
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      body.dataset.active = 'info';
      getInteraction('translate').setActive(false);
    });
  }
  function datePicker() {
    var format = (lang === 'el') ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    var dateStartPicker;
    var dateEndPicker;
    var dateStartBtn = document.getElementById('infobox__date-start');
    var dateEndBtn = document.getElementById('infobox__date-end');
    var dateStartInput = document.getElementById('listing__general-dateStart');
    var dateEndInput = document.getElementById('listing__general-dateEnd');
    var dateStartPickerInit;
    var dateEndPickerInit;
    var observeDatePicker = new MutationObserver(function observeDatePicker(mutations) {
      var attributeValue;
      mutations.forEach(function foerEachMutation(mutation) {
        if (mutation.attributeName === 'class') {
          attributeValue = $(mutation.target).prop(mutation.attributeName);
          if (attributeValue.indexOf('mddtp-picker--inactive') > -1) {
            utils.removeClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          } else {
            utils.addClass(document.getElementById('appwrapper__infobox'), 'unclickable');
          }
        }
      });
    });
    if (dateStartInput !== null) {
      console.log(dateStartInput.value);
      if (dateStartInput.value !== 'undefined') {
        dateStartPickerInit = moment(dateStartInput.value, format);
      } else {
        dateStartPickerInit = moment();
      }
      dateStartPicker = new dPick.default({
        type: 'date',
        init: dateStartPickerInit,
        future: moment().add(5, 'years'),
        trigger: dateStartInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateStartInput.addEventListener('onOk', function displayPickedate() {
        utils.addClass(this.parentNode, 'is-dirty');
        this.value = dateStartPicker.time.format(format).toString();
      });
      dateStartBtn.addEventListener('click', function showDatePicker() {
        dateStartPicker.toggle();
      });
    }
    if (dateEndInput !== null) {
      if (dateEndInput.value !== 'undefined') {
        dateEndPickerInit = moment(dateStartInput.value, format);
      } else {
        dateEndPickerInit = moment();
      }
      dateEndInput.addEventListener('onOk', function displayPickedate() {
        utils.addClass(this.parentNode, 'is-dirty');
        this.value = dateEndPicker.time.format(format).toString();
      });
      dateEndPicker = new dPick.default({
        type: 'date',
        init: dateEndPickerInit,
        future: moment().add(5, 'years'),
        trigger: dateEndInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      dateEndBtn.addEventListener('click', function showDatePicker() {
        dateEndPicker.toggle();
      });
    }
  }
  function enableEdit() {
    var observeListingInput = new MutationObserver(function observeListingInput(mutations) {
      var attributeValue;
      mutations.forEach(function foerEachMutation(mutation) {
        if (mutation.attributeName === 'data-val') {
          attributeValue = mutation.target.value;
          if (attributeValue === 'Rent' || attributeValue === 'Ενοικίαση') {
            utils.removeClass(document.querySelector('#listing__general-pets-wrapper'), 'visuallyhidden');
          } else {
            utils.addClass(document.querySelector('#listing__general-pets-wrapper'), 'visuallyhidden');
          }
        }
      });
    });
    var map = App.config.commons.map;
    var inputs = content.querySelectorAll('input');
    var labels = content.querySelectorAll('label');
    var buttons = content.querySelectorAll('button');
    var editCloseButton = document.querySelector('.close');
    var editAgreeButton = document.querySelector('.agree');
    var locationSwitch = document.querySelector('#estate_location-toggle');
    var gid = document.querySelector('#estate__info-gid').value;
    var translate = new ol.interaction.Translate({
      features: new ol.Collection([utils.findById(map, 'estates').getSource().getFeatureById(gid)]),
      layers: [utils.findById(map, 'estates')]
    });

    assignValidators();
    translate.set('id', 'translate');
    if (document.getElementById('listing__idAndType-type') !== null) {
      observeListingInput.observe(document.getElementById('listing__idAndType-type'), {
        attributes: true,
        characterData: true
      });
    }
    translate.on('translateend', function setTranslatedCoordinates(e) {
      var element = document.querySelector('#estate');
      element.dataset.newx = e.coordinate[0];
      element.dataset.newy = e.coordinate[1];
      locationSwitch.checked = false;
      utils.removeClass(locationSwitch.parentNode, 'is-checked');
      // App.config.modules.info.init();
      translate.setActive(false);
    });
    map.addInteraction(translate);
    translate.setActive(false);

    locationSwitch.addEventListener('click', function watchLocationSwitch() {
      if (this.checked) {
        // App.config.modules.info.disable();
        translate.setActive(true);
      } else {
        // App.config.modules.info.init();
        translate.setActive(false);
      }
    });

    [].forEach.call(document.getElementsByClassName('listing'), function removeDisabledListing(el) {
      utils.removeClass(el, 'listing-disabled');
    });

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

    utils.removeClass(document.querySelector('#confirmBtns'), 'visuallyhidden');
    editCloseButton.addEventListener('click', function cancelEdit() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      body.dataset.active = 'info';
      getInteraction('translate').setActive(false);
    });
    editAgreeButton.addEventListener('click', function updateEdit() {
      // sanitize();
      var data = collectValues();
      console.log(data);
      update(data);
    });
    datePicker();
  }

  function init() {
    info.disable();
    enableEdit();
  }

  return {
    init: init
  };
}(window, document, Promise, $, mdDateTimePicker, moment, App));
