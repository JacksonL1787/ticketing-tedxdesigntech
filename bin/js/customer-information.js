"use strict";

var check = function check() {
  var checkStatus = true;
  $('input').each(function () {
    if (!$(this).hasClass('address-line-two-inpt')) {
      if ($(this).val().replace(/ /g, '')) {
        if ($(this).val().length <= 0) {
          checkStatus = false;
          return;
        }

        if ($('.email-inpt').val()) {
          if (!$('.email-inpt').val().includes("@") || !$('.email-inpt').val().includes(".")) {
            checkStatus = false;
          }
        }
      } else {
        checkStatus = false;
      }
    }
  });

  if (checkStatus) {
    $('.next-step').removeClass('disabled');
  } else {
    $('.next-step').addClass('disabled');
  }
};

var setCustomerInformation = function setCustomerInformation() {
  if (window.customerData) {
    $('.first-name-inpt').val(window.customerData.firstName);
    $('.last-name-inpt').val(window.customerData.lastName);
    $('.email-inpt').val(window.customerData.email);
    $('.phone-number-inpt').val(window.customerData.phoneNumber);
    $('.address-line-one-inpt').val(window.customerData.addressLineOne);
    $('.address-line-two-inpt').val(window.customerData.addressLineTwo);
    $('.city-inpt').val(window.customerData.city);
    $('.state-inpt').val(window.customerData.state);
    $('.zip-code-inpt').val(window.customerData.zipCode);
    check();
  }
};

$('input').on('input', check);
$('.next-step').click(function () {
  if (!$(this).hasClass('disabled')) {
    var data = {
      firstName: $('.first-name-inpt').val(),
      lastName: $('.last-name-inpt').val(),
      email: $('.email-inpt').val(),
      phoneNumber: $('.phone-number-inpt').val(),
      address: {
        addressLineOne: $('.address-line-one-inpt').val(),
        addressLineTwo: $('.address-line-two-inpt').val(),
        city: $('.city-inpt').val(),
        state: $('.state-inpt').val(),
        zipCode: $('.zip-code-inpt').val()
      }
    };
    $.post({
      url: "/api/addCustomerInformation",
      data: data,
      success: function success() {
        window.location.href = "/seats/information";
      }
    });
  }
});
$(document).ready(function () {
  setCustomerInformation();
});
$('.go-back-btn').click(function () {
  window.location.href = "/seats/selection";
});
//# sourceMappingURL=customer-information.js.map
