var handleForm = (function ($, parsley) {
  'use strict';
  var formName, submitBtnId, p;

  function setOptions(options) {
    formName = options.name;
    submitBtnId = options.submitBtnId;
    enableSelect();
  }
  function enableSelect() {
    var e = $('.getmdl-select');
    e.each(function () {
      addEventListeners(this);
    });
  }
  function addEventListeners(e) {
    var t = e.querySelector('input'),
      n = e.querySelectorAll('li');
    e.querySelector('i');
    [].forEach.call(n, function (e) {
      e.onclick = function () {
        t.value = e.textContent;
      };
    });
  }
  function disableSubmitBtn() {
    $('#' + submitBtnId + '').prop('disabled', true);
  }

  function createValidator() {
    p = $('form[name="' + formName + '"').parsley();
    return true;
  }

  function destroyValidator() {
    p.destroy();
  }

  function validateForm() {
    return p.validate();
  }

  function onValidateFormSuccess() {
    p.on('form:success',

      function () {});
  }
  function setAttributes(atr) {
    $('#street_el').val(atr.street_el);
    $('#street_en').val(atr.street_en);
  }
  function getAttributes() {
    var obj = {};
    createValidator();
    if (validateForm() === true) {
      $('form[name="' + formName + '"').find('.mdl-textfield__input').each(

        function (index, element) {
          obj[$(this).attr('id')] = $(this).val();
        });
      $('form[name="' + formName + '"').find('.mdl-checkbox__input').each(

        function (index, element) {
          obj[$(this).attr('id')] = $(this).prop('checked');
        });
      $('form[name="' + formName + '"').find('.mdl-radio__button').each(
        function (index, element) {
          obj[$(this).attr('id')] = $(this).prop('checked');
        });
      $('form[name="' + formName + '"').find('.mdl-selectfield__select').each(
        function (index, element) {
          obj[$(this).attr('id')] = $(this).val();
        });
      return obj;
    }
    else return null;
  }

  function resetForm() {
    if (createValidator() == true) {
      destroyValidator();
    }
    $('form[name="' + formName + '"').find('.mdl-textfield__input').each(

      function (index, element) {
        $(this).val('');
        $(this).parent().eq(0).removeClass('is-dirty');
        $(this).parent().eq(0).removeClass('is-invalid');
      });
    $('form[name="' + formName + '"').find('.mdl-checkbox__input').each(

      function (index, element) {
        $(this).prop('checked', false);
      });
    $('form[name="' + formName + '"').find('.mdl-checkbox').each(

      function (index, element) {
        $(this).removeClass('is-checked');
      });
  }
  return {
    set: setOptions,
    get: getAttributes,
    clear: resetForm,
    setAttributes: setAttributes
  // createValidator: createValidator,
  // destroyValidator: destroyValidator,
  // validateForm: validateForm,
  // onValidateFormSuccess: onValidateFormSuccess,
  // disableSubmitBtn: disableSubmitBtn
  };
}(jQuery, parsley));
