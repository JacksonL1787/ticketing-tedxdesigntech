"use strict";

var orderData = new Object();
/*

  MODULE 1 FUNCTIONS

*/

$(function () {
  var seatsPerRow = 30;
  var vipRows = ['A', 'B', 'C'];
  var rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  var seatCount = 0;

  var createSeats = function createSeats() {
    for (var i = 1; i <= rowNames.length; i++) {
      var column1 = [],
          column2 = [];

      for (var a = 1; a <= seatsPerRow; a++) {
        var classes = vipRows.includes(rowNames[i - 1]) ? 'seat available vip-seat' : 'seat available';

        if (a > seatsPerRow / 2) {
          column2.push("<div class=\"".concat(classes, "\" data-seat=\"").concat(rowNames[i - 1]).concat(a, "\"><div class=\"icon\"></div></div>"));
        } else {
          column1.push("<div class=\"".concat(classes, "\" data-seat=\"").concat(rowNames[i - 1]).concat(a, "\"><div class=\"icon\"></div></div>"));
        }
      }

      $('.module1 .seat-wrap').append("<div class=\"row row".concat(i, "\"><div class=\"column1 column\">").concat(column1.join(""), "</div><p class=\"row-letter\">").concat(rowNames[i - 1], "</p><div class=\"column2 column\">").concat(column2.join(""), "</div></div>"));
    }
  };

  var markTakenSeats = function markTakenSeats() {
    if (window.takenSeats) {
      window.takenSeats.forEach(function (item) {
        console.log(item.name);
        $(".module1 .seat-wrap .seat[data-seat=\"".concat(item.name, "\"]")).addClass('taken').removeClass('available');
      });
    }
  };

  var selectCurrentSeats = function selectCurrentSeats() {
    if (window.userSeats) {
      window.userSeats.forEach(function (item) {
        var newDiv = document.createElement('div');
        newDiv.setAttribute('data-seat', item.name);

        if (item.type === "VIP") {
          newDiv.setAttribute('class', 'vip-seat');
        }

        $(".seat-wrap .seat[data-seat=\"".concat(item.name, "\"]")).addClass('selected');
        selectSeat($(newDiv));
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

  $('.module1 .cancel-btn').click(function () {
    if (orderData.orderId) {
      $.post({
        url: '/admin/api/cancelOrder',
        data: {
          orderId: orderData.orderId
        },
        success: function success() {
          window.close();
        }
      });
    } else {
      window.close();
    }
  });
  $(document).on('click', '.module1 .seat-wrap .seat', function () {
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
  var check = function check() {
    var checkStatus = true;
    $('.module2 input').each(function () {
      if (!$(this).hasClass('address-line-two-inpt')) {
        if ($(this).val().replace(/ /g, '')) {
          if ($(this).val().length <= 0) {
            checkStatus = false;
            return;
          }

          if ($('.module2 .email-inpt').val()) {
            if (!$('.module2 .email-inpt').val().includes("@") || !$('.module2 .email-inpt').val().includes(".")) {
              checkStatus = false;
            }
          }
        } else {
          checkStatus = false;
        }
      }
    });

    if (checkStatus) {
      $('.module2 .next-step').removeClass('disabled');
    } else {
      $('.module2 .next-step').addClass('disabled');
    }
  };

  $('.module2 input').on('input', check);
  $('.module2 .go-back-btn').click(function () {
    $('.module1').removeClass('hidden');
    $('.module2').addClass('hidden');
  });
  $('.module1 .next-step').click(function () {
    if (!$(this).hasClass('disabled')) {
      $('.module1').addClass('hidden');
      $('.module2').removeClass('hidden');
      var data = {
        seats: [],
        orderId: orderData.orderId
      };
      $('.module1 .seat-wrap .seat.selected').each(function () {
        data.seats.push($(this).data('seat'));
      });
      $.post({
        url: "/admin/api/beginOrder",
        data: data,
        success: function success(result) {
          orderData.orderId = result.orderId;
        }
      });
    }
  });
});
/*

  MODULE 3 FUNCTIONS

*/

$(function () {
  var vipRows = ['A', 'B', 'C'];

  var appendInputs = function appendInputs() {
    var seats = orderData.seats;
    seats.forEach(function (item) {
      var inputVal = '';

      if (item.name) {
        inputVal = item.name;
        $('.module3 .next-step').removeClass('disabled');
      }

      var appendWrap = '.ga-tickets';

      if (vipRows.includes(item.seat[0])) {
        appendWrap = '.vip-tickets';
      }

      $(".module3 .form-content ".concat(appendWrap, " .inputs-wrap")).append("<div class=\"seat-input-wrap\" data-seat=\"".concat(item.seat, "\"><div class=\"seat-number-wrap\"><p class=\"seat-number\">").concat(item.seat, "</p></div><input value=\"").concat(inputVal, "\" class=\"seat-name-inpt\" type=\"text\" placeholder=\"First and Last Name\" onkeypress=\"return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32\"/></div>"));
    });

    if ($('.module3 .ga-tickets .inputs-wrap').children().length == 0) {
      $('.module3 .ga-tickets .no-tickets').show();
      $('.module3 .ga-tickets .inputs-wrap').hide();
    } else {
      $('.module3 .ga-tickets .no-tickets').hide();
      $('.module3 .ga-tickets .inputs-wrap').show();
    }

    if ($('.module3 .vip-tickets .inputs-wrap').children().length == 0) {
      $('.module3 .vip-tickets .no-tickets').show();
      $('.module3 .vip-tickets .inputs-wrap').hide();
    } else {
      $('.module3 .vip-tickets .no-tickets').hide();
      $('.module3 .vip-tickets .inputs-wrap').show();
    }
  };

  $(document).on('input', '.module3 .seat-name-inpt', function () {
    var inputVal = $(this).val();
    var check = true;
    $('.module3 .seat-name-inpt').each(function () {
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
      $('.module3 .finish-order-btn').removeClass('disabled');
    } else {
      $('.module3 .finish-order-btn').addClass('disabled');
    }
  });
  $('.module3 .go-back-btn').click(function () {
    $('.module2').removeClass('hidden');
    $('.module3').addClass('hidden');
    $('.module3 .inputs-wrap').empty();
  });
  $('.module2 .next-step').click(function () {
    if (!$(this).hasClass('disabled')) {
      $('.module2').addClass('hidden');
      orderData.seats = [];
      $('.module1 .seat-wrap .selected').each(function () {
        orderData.seats.push({
          seat: $(this).attr('data-seat')
        });
      });
      $('.module3').removeClass('hidden');
      appendInputs();
    }
  });
});
$(function () {
  var count = 1;

  var setupSuccessfulOrderPage = function setupSuccessfulOrderPage() {
    $('.order-complete-page .info').text("This order has been processed successfully. Information regarding the order has been sent to ".concat($('.first-name-inpt').val(), " ").concat($('.last-name-inpt').val(), " via email."));
    $('.top-tag-wrap .tag-text').text('Now you may close/reload the page.');
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
      var data = {
        firstName: $('.first-name-inpt').val(),
        lastName: $('.last-name-inpt').val(),
        email: $('.email-inpt').val(),
        phoneNumber: $('.phone-number-inpt').val(),
        addressLineOne: $('.address-line-one-inpt').val(),
        addressLineTwo: $('.address-line-two-inpt').val(),
        city: $('.city-inpt').val(),
        state: $('.state-inpt').val(),
        zipCode: $('.zip-code-inpt').val(),
        orderId: orderData.orderId,
        seats: []
      };
      $('.module1 .seat-wrap .seat.selected').each(function () {
        data.seats.push({
          name: $(this).data('seat'),
          attendeeName: $(".module3 .seat-input-wrap[data-seat=\"".concat($(this).data('seat'), "\"] input")).val()
        });
      });
      console.log(data);
      $.post({
        url: '/admin/api/completeOrder',
        data: data,
        success: function success() {
          $('.module3').addClass('hidden');
          $('.order-complete-page').removeClass('hidden');
          setupSuccessfulOrderPage();
        }
      });
    }
  });
});
//# sourceMappingURL=admin-create-ticket.js.map
