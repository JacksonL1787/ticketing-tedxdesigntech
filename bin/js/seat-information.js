"use strict";

var vipRows = ['A', 'B', 'C'];

var appendInputs = function appendInputs() {
  var seats = window.seatData.seats;
  seats.forEach(function (item) {
    var inputVal = '';

    if (item.name) {
      inputVal = item.name;
      $('.next-step').removeClass('disabled');
    }

    var appendWrap = '.ga-tickets';

    if (vipRows.includes(item.seat[item.seat.length - 1])) {
      appendWrap = '.vip-tickets';
    }

    $(".form-content ".concat(appendWrap, " .inputs-wrap")).append("<div class=\"seat-input-wrap\" data-seat=\"".concat(item.seat, "\"><div class=\"seat-number-wrap\"><p class=\"seat-number\">").concat(item.seat, "</p></div><input value=\"").concat(inputVal, "\" class=\"seat-name-inpt\" type=\"text\" placeholder=\"First and Last Name\" onkeypress=\"return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32\"/></div>"));
  });

  if ($('.ga-tickets .inputs-wrap').children().length == 0) {
    $('.ga-tickets .no-tickets').show();
    $('.ga-tickets .inputs-wrap').hide();
  }

  if ($('.vip-tickets .inputs-wrap').children().length == 0) {
    $('.vip-tickets .no-tickets').show();
    $('.vip-tickets .inputs-wrap').hide();
  }
};

$('.go-back-btn').click(function () {
  window.location.href = "/seats/selection";
});
$(document).on('input', '.seat-name-inpt', function () {
  var inputVal = $(this).val();
  var check = true;
  $('.seat-name-inpt').each(function () {
    var valArr = $(this).val().split(" ");

    if (valArr.length >= 2) {
      if (valArr[0].length <= 0 || valArr[1].length <= 0) {
        check = false;
        return;
      }
    } else {
      check = false;
      return;
    }
  });

  if (check) {
    $('.next-step').removeClass('disabled');
  } else {
    $('.next-step').addClass('disabled');
  }
});
$('.next-step').click(function () {
  if (!$(this).hasClass('disabled')) {
    var data = {
      seats: []
    };
    $('.seat-name-inpt').each(function () {
      var seat = $(this).parent().attr('data-seat');
      var val = $(this).val();
      var tempObj = {
        seat: seat,
        name: val
      };
      data.seats.push(tempObj);
    });
    $.post({
      url: "/seatNames",
      data: data,
      success: function success() {
        window.location.href = "/customer/information";
      }
    });
  }
});
$(document).ready(function () {
  appendInputs();
});
//# sourceMappingURL=seat-information.js.map
