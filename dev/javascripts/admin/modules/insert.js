App.config.modules.insert = (function edit(window, document, Promise, $, App, dPick, moment, dialogPolyfill, cloudinary, bowser) {
  'use strict';
  var lang = document.documentElement.lang;
  var body = document.querySelector('body');
  var utils = App.utils;
  var dustBluebird = App.config.promises.dustBluebird;
  var content = document.getElementById('appwrapper__infobox-content');
  var addButton = document.getElementById('insert');
  var info = App.config.modules.info;
  var drawnCollection = new ol.Collection();
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
      document.getElementById('activeModule').innerHTML = 'Information';
    }
  }
  function invalidate() {
    var inputs = content.querySelectorAll('input[type=text]');
    Array.prototype.map.call(inputs, function setInvalid(obj) {
      if (obj.value === '') {
        utils.addClass(obj.parentNode, 'is-invalid');
      } else {
        utils.removeClass(obj.parentNode, 'is-invalid');
      }
    });
  }
  function checkEmpty() {
    var inputs = content.querySelectorAll('input[type=text]');
    return _.some(inputs, function isEmpty(input) {
      if (input.value === '') {
        return true;
      }
      return false;
    });
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
  function datePicker() {
    var format = (lang === 'el') ? 'DD-MM-YYYY' : 'MM-DD-YYYY';
    var dateStartPicker;
    var dateEndPicker;
    var dateStartBtn = document.getElementById('infobox__date-start');
    var dateEndBtn = document.getElementById('infobox__date-end');
    var dateStartInput = document.getElementById('listing__general-dateStart');
    var dateEndInput = document.getElementById('listing__general-dateEnd');
    var observeDatePicker = new MutationObserver(function observeDatePicker(mutations) {
      var attributeValue;
      mutations.forEach(function toggleUnclickableInfobox(mutation) {
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
      dateStartPicker = new dPick.default({
        type: 'date',
        init: moment(),
        future: moment().add(5, 'years'),
        trigger: dateStartInput,
        orientation: 'PORTRAIT'
      });
      observeDatePicker.observe(document.getElementById('mddtp-picker__date'), {
        attributes: true
      });
      if (bowser.name !== 'Chrome') {
        dateStartInput.removeAttribute('disabled');
        dateStartInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateStartPicker.time.format(format).toString();
          this.disabled = true;
        });
      } else {
        dateStartInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateStartPicker.time.format(format).toString();
        });
      }
      dateStartBtn.addEventListener('click', function showDatePicker() {
        dateStartPicker.toggle();
      });
    }
    if (dateEndInput !== null) {
      if (bowser.name !== 'Chrome') {
        dateEndInput.removeAttribute('disabled');
        dateEndInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateEndPicker.time.format(format).toString();
          this.disabled = true;
        });
      } else {
        dateEndInput.addEventListener('onOk', function displayPickedate() {
          utils.addClass(this.parentNode, 'is-dirty');
          this.value = dateEndPicker.time.format(format).toString();
        });
      }
      dateEndPicker = new dPick.default({
        type: 'date',
        init: moment(),
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
  function assignValidators() {
    var inputs = content.querySelectorAll('input[type=text]');
    [].forEach.call(inputs, function makeParsleyInputs(el) {
      el.addEventListener('blur', function snitize() {
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
  function collectValues(getXY) {
    var map = App.config.commons.map;
    var values = {};
    var filteredValues = {};
    var inputs = content.querySelectorAll('input[type=text]');
    var checkboxes = content.querySelectorAll('input[type=checkbox]');
    values.estate = {};
    values.listing = {};
    if (getXY) {
      values.estate.x = utils.findById(map, 'newEstates')
      .getSource().getFeatures()[0].getGeometry().getCoordinates()[0];
      values.estate.y = utils.findById(map, 'newEstates')
      .getSource().getFeatures()[0].getGeometry().getCoordinates()[1];
    } else {
      values.estate.x = document.getElementById('estate').dataset.originalx;
      values.estate.y = document.getElementById('estate').dataset.originaly;
    }
    [].forEach.call(inputs, function collectFromInputs(el) {
      var name = _.last(_.split(el.getAttribute('id'), '-', 3));
      var value = el.value;
      if (lang === 'el') {
        if (name === 'type' && el.id === 'estate__general_estate-type') {
          values.estate.estatetypeEn = setEstateType(value);
          values.estate.estatetype = value;
        } else if (name === 'type' && el.id === 'listing__idAndType-type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        }
        if (name === 'address') {
          values.estate.streetEn = utils.elToEn(value);
          values.estate.streetEl = value;
        }
      } else {
        if (name === 'type' && el.id === 'estate__general_estate-type') {
          values.estate.estatetypeEn = value;
          values.estate.estatetype = setEstateType(value);
        } else if (name === 'type' && el.id === 'listing__idAndType-type') {
          if (value === 'Sale' || value === 'Πώληση') {
            values.listing.sale = true;
            values.listing.rent = false;
          } else {
            values.listing.sale = false;
            values.listing.rent = true;
          }
        }
        if (name === 'address') {
          values.estate.streetEn = value;
          values.estate.streetEl = utils.elToEn(value);
        }
      }
      if (name === 'addressNumber') {
        values.estate.streetNumber = value;
      }
      if (name === 'price') {
        values.listing.price = value;
      }
      if (name === 'dateStart' || name === 'dateEnd') {
        values.listing[name] = value;
      } else {
        values.estate[name] = value;
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
  function ajaxEstateAndListing(data) {
    console.log(data);
    data.estate.adminId = window.id;
    console.log(data.estate);
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'POST',
        data: data.estate
      })
      )
    .then(function resolve(estatedata) {
      var gid = estatedata.gid;
      var uploadOptions = {
        cloud_name: 'firvain',
        upload_preset: 'testupload',
        folder: gid,
        client_allowed_formats: 'jpg',
        theme: 'minimal',
        tags: gid
      };
      cloudinary.openUploadWidget(uploadOptions, function upload(error, result) {
        console.log(error, result);
      });
      return gid;
    })
    .then(function resolve(gid) {
      data.listing.gid = gid;
      return $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'POST',
        data: data.listing
      });
    })
    .finally(function closeInsert() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      body.dataset.active = 'info';
      info.init();
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function ajaxListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'POST',
        data: _.merge({ gid: data.gid }, data.listing)
      })
      )
    .then(function resolve(result) {
      console.log(result);
    })
    .finally(function closeInsert() {
      clearContent();
      utils.addClass(content, 'visuallyhidden');
      body.dataset.active = 'info';
      info.init();
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function renderDustListing() {
    dustBluebird.renderAsync('insertListing', _.cloneDeep(App.config.commons.trans))
    .then(function resolve(data) {
      var agree = document.getElementById('confirmBtns__agree');
      var disagree = document.getElementById('confirmBtns__disagree');
      $('#estate').after(data);
      getmdlSelect.init('.getmdl-select');
      utils.removeClass(document.getElementById('confirmBtns'), 'visuallyhidden');
      assignValidators();
      datePicker();
      disagree.addEventListener('click', function insertAgree(e) {
        e.preventDefault();
        e.stopPropagation();
        clearContent();
        content.innerHTML = '';
        utils.addClass(content, 'visuallyhidden');
        body.dataset.active = info;
        info.init();
      });
      agree.addEventListener('click', function insertContinue(e) {
        var ajaxData;
        e.preventDefault();
        e.stopPropagation();
        if (checkEmpty() !== true) {
          ajaxData = collectValues(false);
          ajaxData.gid = document.getElementById('estate__info-gid').value;
          ajaxListing(ajaxData);
        } else {
          invalidate();
        }
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function renderDustEsateAndListing() {
    var map = App.config.commons.map;
    var draw = getInteraction('newEstate');
    var renderData = _.cloneDeep(App.config.commons.trans);
    dustBluebird.renderAsync('insert', renderData)
    .then(function resolve(data) {
      clearContent();
      content.innerHTML = data;
      utils.removeClass(content, 'visuallyhidden');
      getmdlSelect.init('.getmdl-select');
    })
    .then(function resolve(data) {
      var agree = document.getElementById('confirmBtns__agree');
      var disagree = document.getElementById('confirmBtns__disagree');
      var listing = document.getElementById('listing');
      assignValidators();
      datePicker();
      disagree.addEventListener('click', function insertAgree(e) {
        e.preventDefault();
        e.stopPropagation();
        clearContent();
        // content.innerHTML = data;
        utils.addClass(content, 'visuallyhidden');
        body.dataset.active = info;
        draw.setActive(false);
        utils.findById(map, 'newEstates').getSource().clear();
        info.init();
      });
      agree.addEventListener('click', function insertContinue(e) {
        e.preventDefault();
        e.stopPropagation();
        utils.removeClass(listing, 'visuallyhidden');
        this.innerHTML = 'Agree';
        e.target.removeEventListener(e.type, insertContinue);
        this.addEventListener('click', function insertAgree(evt) {
          var ajaxData;
          evt.preventDefault();
          evt.stopPropagation();
          // e.target.removeEventListener(e.type, insertAgree);
          if (checkEmpty() !== true) {
            ajaxData = collectValues(true);
            ajaxEstateAndListing(ajaxData);
          } else {
            invalidate();
          }
        });
      });
    })
    .catch(function error(e) {
      console.log(e);
    });
  }

  function createDrawInteraction() {
    var map = App.config.commons.map;
    var draw = new ol.interaction.Draw({
      features: drawnCollection,
      source: utils.findById(map, 'newEstates').getSource(),
      type: 'Point'
    });
    draw.set('id', 'newEstate');
    draw.setActive(false);
    map.addInteraction(draw);
  }
  function checkEstate() {
    if (content.innerHTML === 'undefined' || content.innerHTML === '') {
      return 0; // no estate or listing
    } else if (content.innerHTML !== 'undefined' && document.getElementById('listing') !== null) {
      return 1;  // there is a listing
    }
    return 2; // there is no listing
  }

  function insert() {
    var map = App.config.commons.map;
    var draw = getInteraction('newEstate');
    var newEstates = utils.findById(map, 'newEstates');
    info.disable();
    console.log(checkEstate());
    if (checkEstate() === 0) {
      document.getElementById('activeModule').innerHTML = 'Add Estate And Listing';
      draw.setActive(true);
      utils.findById(map, 'newEstates').setVisible(true);
      drawnCollection.on('change:length', function keepOnlyOneEstate() {
        if (this.getLength() > 0) {
          draw.setActive(false);
          newEstates.getSource().clear();
        }
      });
      draw.on('drawend', renderDustEsateAndListing);
    } else if (checkEstate() === 2) {
      document.getElementById('activeModule').innerHTML = 'Add Listing';
      draw.setActive(false);
      renderDustListing();
    } else {
      draw.setActive(false);
      document.getElementById('activeModule').innerHTML = 'Information';
      info.init();
    }
  }

  function init() {
    if (_.isEmpty(getInteraction('newEstate'))) {
      createDrawInteraction();
    }
    insert();
  }
  return {
    init: init
  };
}(window, document, Promise, jQuery, App, mdDateTimePicker, moment, dialogPolyfill, cloudinary, bowser));
