var handleForm = (function ($) {
  'use strict';
  var formName;
  // form = $('form[name="' + this.name + '"]');
  function setName(name) {
    formName = name;
  }

  function getAttributes() {
    var obj = {};
    $('form[name="' + formName + '"').find('.mdl-textfield__input').each(function (index, element) {
      obj[$(this).attr('id')] = $(this).val();
    });
    $('form[name="' + formName + '"').find('.mdl-checkbox__input').each(function (index, element) {
      obj[$(this).attr('id')] = $(this).prop('checked');
    });
    return obj;
  }

  function resetForm() {
    $('form[name="' + formName + '"').find('.mdl-textfield__input').each(function (index, element) {
      $(this).val('');
      $(this).parent().eq(0).removeClass('is-dirty');
      $(this).parent().eq(0).removeClass('is-invalid');
    });
    $('form[name="' + formName + '"').find('.mdl-checkbox__input').each(function (index, element) {
      $(this).prop('checked', false);
    });
    $('form[name="' + formName + '"').find('.mdl-checkbox').each(function (index, element) {
      $(this).removeClass('is-checked');
    });
  }
  return {
    set: setName,
    get: getAttributes,
    clear: resetForm
  };
}(jQuery));
