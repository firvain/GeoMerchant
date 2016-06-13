App.config.modules.delete = (function edit(window, document, Promise, $, App, dialogPolyfill) {
  'use strict';
  var utils = App.utils;
  var dustBluebird = App.config.promises.dustBluebird;
  var deleteButton = document.getElementById('delete');
  var editButton = document.getElementById('edit');
  var dialog = document.querySelector('dialog');
  var snackbarContainer = document.querySelector('#appwrapper__snackbar');
  var content = document.getElementById('appwrapper__infobox-content');
  var body = document.querySelector('body');
  var info = App.config.modules.info;
  function clearContent() {
    if (content.children.length > 0) {
      content.innerHTML = '';
    }
  }
  function updateEstates() {
    var map = App.config.commons.map;
    utils.findById(map, 'estates').getSource().clear();
  }
  function deleteListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/listing',
        type: 'DELETE',
        data: { id: data }
      })
      )
    .then(function resolve(deleteListingresult) {
      console.log(deleteListingresult);
      content.querySelector('#listing').innerHTML = '';
      content.querySelector('#listing').parentNode.removeChild(content.querySelector('#listing'));
    })
    .finally(function enableInfo() {
      var map = App.config.commons.map;
      clearContent();
      body.dataset.active = 'info';
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      info.init();
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    });
  }
  function deleteEstateAndListing(data) {
    Promise.resolve(
      $.ajax({
        url: 'http://127.0.0.1:3000/api/property',
        type: 'DELETE',
        data: { gid: data }
      })
      )
    .then(function resolve() {
      updateEstates();
    })
    .finally(function enableInfo() {
      var map = App.config.commons.map;
      clearContent();
      body.dataset.active = 'info';
      info.init();
      editButton.setAttribute('disabled', true);
      deleteButton.setAttribute('disabled', true);
      utils.findById(map, 'estates').getSource().getFeatures()
      .forEach(function resetStyle(feature) {
        feature.setStyle(null);
      });
    })
    .catch(function error(e) {
      var msg = { message: e };
      console.log(e);
      snackbarContainer.MaterialSnackbar.showSnackbar(msg);
    });
  }
  function whatToDelete() {
    var checkboxes = dialog.querySelectorAll('input[name=options]');
    var values = {};
    if (checkboxes.length !== 0) {
      [].forEach.call(checkboxes, function getValues(el) {
        var key = _.last(_.split(el.getAttribute('id'), '-', 3));
        values[key] = el.checked;
      });
    }
    return values;
  }
  function cancelDelete() {
    dialog.close();
  }
  function confirmDelete() {
    var data;
    var chooser = whatToDelete();
    if (_.isEmpty(chooser)) {
      data = document.getElementById('estate__info-gid').value;
      deleteEstateAndListing(data);
    } else {
      if (chooser.listing === true) {
        data = document.getElementById('listing__idAndType-id').value;
        deleteListing(data);
      }
      if (chooser.estate === true) {
        data = document.getElementById('estate__info-gid').value;
        deleteEstateAndListing(data);
      }
    }
    dialog.close();
  }
  function show() {
    var listing = document.getElementById('listing__idAndType-id');
    var data = {};
    if (listing === null) {
      data.title = 'Delete Estate';
      data.choose = false;
    } else {
      data.title = 'Please choose what you want to delete';
      data.choose = true;
    }
    dustBluebird.renderAsync('deleteDialog', data)
    .then(function resolveDust(result) {
      dialog.innerHTML = result;
      dialog.showModal();
    })
    .then(function resolve() {
      dialog.querySelector('#cancelDelete').addEventListener('click', cancelDelete);
      dialog.querySelector('#confirmDelete').addEventListener('click', confirmDelete);
    })
    .catch(function error(e) {
      console.log(e);
    });
  }
  function initDialog() {
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    show();
  }
  return {
    init: initDialog
  };
}(window, document, Promise, jQuery, App, dialogPolyfill));
