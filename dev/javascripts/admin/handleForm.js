var handleForm = (function ($, parsley) {
  'use strict';
  var formName, submitBtnId, p;
  function setOptions(options) {
    formName = options.name;
    submitBtnId = options.submitBtnId;
  }

  function disableSubmitBtn() {
    $("#" + submitBtnId + "").prop("disabled", true);
  }

  function createValidator() {
    p = $('form[name="' + formName + '"').parsley();
  }

  function destroyValidator() {
    p.destroy();
  }

  function validateForm() {
    return p.validate();
  }

  function onValidateFormSuccess() {
    p.on('form:success', function () {});
  }


  function getAttributes() {
    var obj = {};
    createValidator();
    
    if (validateForm() === true) {
      alert('ok');
      $('form[name="' + formName + '"').find('.mdl-textfield__input').each(function (index, element) {
        obj[$(this).attr('id')] = $(this).val();
      });
      $('form[name="' + formName + '"').find('.mdl-checkbox__input').each(function (index, element) {
        obj[$(this).attr('id')] = $(this).prop('checked');
      });
      return obj;
    }
    else return null;
  }

  function resetForm() {
    destroyValidator();
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
    set: setOptions,
    get: getAttributes,
    clear: resetForm
    // createValidator: createValidator,
    // destroyValidator: destroyValidator,
    // validateForm: validateForm,
    // onValidateFormSuccess: onValidateFormSuccess,
    // disableSubmitBtn: disableSubmitBtn
  };
}(jQuery, parsley));

