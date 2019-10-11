"use strict";

var orderData = new Object();
/*

  MODULE 1 FUNCTIONS

*/

$(function () {
  var rows = 12;
  var seatsPerRow = 30;
  var vipRows = ['A', 'B', 'C'];
  var rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  var seatCount = 0;

  var createSeats = function createSeats() {
    for (var i = 1; i <= rows; i++) {
      var column1 = [];
      var column2 = [];

      for (var a = 1; a <= seatsPerRow; a++) {
        var classes = 'seat available';

        if (vipRows.includes(rowNames[i - 1])) {
          classes = classes + ' vip-seat';
        }

        if (a > seatsPerRow / 2) {
          column2.push("<div class=\"".concat(classes, "\" data-seat=\"").concat(a).concat(rowNames[i - 1], "\"><div class=\"icon\"></div></div>"));
        } else {
          column1.push("<div class=\"".concat(classes, "\" data-seat=\"").concat(a).concat(rowNames[i - 1], "\"><div class=\"icon\"></div></div>"));
        }
      }

      $('.module1 .seat-wrap').append("<div class=\"row row".concat(i, "\"><div class=\"column1 column\">").concat(column1.join(""), "</div><p class=\"row-letter\">").concat(rowNames[i - 1], "</p><div class=\"column2 column\">").concat(column2.join(""), "</div></div>"));
    }
  };

  var markTakenSeats = function markTakenSeats() {
    if (window.takenSeats) {
      window.takenSeats.forEach(function (item) {
        $(".module1 .seat-wrap .seat[data-seat=\"".concat(item, "\"]")).addClass('taken').removeClass('available');
      });
    }
  };

  var checkButton = function checkButton() {
    if (seatCount > 0) {
      $('.module1 .next-step').removeClass('disabled');
    } else {
      $('.module1 .next-step').addClass('disabled');
    }
  };

  $(document).on('click', '.module1 .seat', function () {
    if (!$(this).hasClass('taken')) {
      if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
        seatCount--;
      } else {
        seatCount++;
        $(this).addClass('selected');
      }

      checkButton();
    }
  });
  $(document).ready(function () {
    createSeats();
    markTakenSeats();
  });
});
/*

  MODULE 2 FUNCTIONS

*/

$(function () {
  var vipRows = ['A', 'B', 'C'];

  var appendInputs = function appendInputs() {
    var seats = orderData.seats;
    seats.forEach(function (item) {
      var inputVal = '';

      if (item.name) {
        inputVal = item.name;
        $('.module2 .next-step').removeClass('disabled');
      }

      var appendWrap = '.ga-tickets';

      if (vipRows.includes(item.seat[item.seat.length - 1])) {
        appendWrap = '.vip-tickets';
      }

      $(".module2 .form-content ".concat(appendWrap, " .inputs-wrap")).append("<div class=\"seat-input-wrap\" data-seat=\"".concat(item.seat, "\"><div class=\"seat-number-wrap\"><p class=\"seat-number\">").concat(item.seat, "</p></div><input value=\"").concat(inputVal, "\" class=\"seat-name-inpt\" type=\"text\" placeholder=\"First and Last Name\" onkeypress=\"return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32\"/></div>"));
    });

    if ($('.module2 .ga-tickets .inputs-wrap').children().length == 0) {
      $('.module2 .ga-tickets .no-tickets').show();
      $('.module2 .ga-tickets .inputs-wrap').hide();
    } else {
      $('.module2 .ga-tickets .no-tickets').hide();
      $('.module2 .ga-tickets .inputs-wrap').show();
    }

    if ($('.module2 .vip-tickets .inputs-wrap').children().length == 0) {
      $('.module2 .vip-tickets .no-tickets').show();
      $('.module2 .vip-tickets .inputs-wrap').hide();
    } else {
      $('.module2 .vip-tickets .no-tickets').hide();
      $('.module2 .vip-tickets .inputs-wrap').show();
    }
  };

  $(document).on('input', '.module2 .seat-name-inpt', function () {
    var inputVal = $(this).val();
    var check = true;
    $('.module2 .seat-name-inpt').each(function () {
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
      $('.module2 .next-step').removeClass('disabled');
    } else {
      $('.module2 .next-step').addClass('disabled');
    }
  });
  $('.module2 .go-back-btn').click(function () {
    $('.module1').removeClass('hidden');
    $('.module2').addClass('hidden');
    $('.module2 .inputs-wrap').empty();
  });
  $('.module1 .next-step').click(function () {
    if (!$(this).hasClass('disabled')) {
      $('.module1').addClass('hidden');
      orderData.seats = [];
      $('.module1 .seat-wrap .selected').each(function () {
        orderData.seats.push({
          seat: $(this).attr('data-seat')
        });
      });
      $('.module2').removeClass('hidden');
      appendInputs();
    }
  });
});
$(function () {
  var check = function check() {
    var checkStatus = true;
    $('.module3 input').each(function () {
      if (!$(this).hasClass('address-line-two-inpt')) {
        if ($(this).val().replace(/ /g, '')) {
          if ($(this).val().length <= 0) {
            checkStatus = false;
            return;
          }

          if ($('.module3 .email-inpt').val()) {
            if (!$('.module3 .email-inpt').val().includes("@") || !$('.module3 .email-inpt').val().includes(".")) {
              checkStatus = false;
            }
          }
        } else {
          checkStatus = false;
        }
      }
    });

    if (checkStatus) {
      $('.module3 .finish-order-btn').removeClass('disabled');
    } else {
      $('.module3 .finish-order-btn').addClass('disabled');
    }
  };

  $('.module3 input').on('input', check);
  $('.module3 .go-back-btn').click(function () {
    $('.module2').removeClass('hidden');
    $('.module3').addClass('hidden');
  });
  $('.module2 .next-step').click(function () {
    if (!$(this).hasClass('disabled')) {
      $('.module2').addClass('hidden');
      orderData.tempSeats = [];
      $('.module2 .inputs-wrap .seat-name-inpt').each(function () {
        var seat = $(this).parent().attr('data-seat');
        var val = $(this).val();
        var tempObj = {
          seat: seat,
          name: val
        };
        orderData.tempSeats.push(tempObj);
      });
      orderData.seats = orderData.tempSeats;
      delete orderData.tempSeats;
      $('.module3').removeClass('hidden');
    }
  });
});
$(function () {
  var count = 1;

  var setupSuccessfulOrderPage = function setupSuccessfulOrderPage() {
    $('.order-complete-page .info').text("This order has been processed successfully. Information regarding the order has been sent to ".concat(orderData.customerInformation.firstName, " ").concat(orderData.customerInformation.lastName, " via email."));
    setInterval(function () {
      if (count == 15) {
        window.close();
      }

      count++;
      $('.order-complete-page .notify-redirect span').text(parseInt($('.order-complete-page .notify-redirect span').text() - 1));
    }, 1000);
  };

  $('.module3 .finish-order-btn').click(function () {
    if (!$(this).hasClass('disabled')) {
      $('.module3').addClass('hidden');
      orderData.customerInformation = {
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
      $.ajax({
        url: '/admin/createTicket',
        type: 'post',
        data: orderData
      });
      $('.order-complete-page').removeClass('hidden');
      setupSuccessfulOrderPage();
    }
  });
});
//# sourceMappingURL=admin-create-ticket.js.map
