"use strict";

var vipRows = ['A', 'B', 'C'];
$(function () {
  // ADD DATA TO DOCUMENT
  var addCustomerInfo = function addCustomerInfo() {
    var data = order.customerInformation;
    console.log(data);
    $('.customer-info-widget .first-name-inpt').val(data.firstName);
    $('.customer-info-widget .last-name-inpt').val(data.lastName);
    $('.customer-info-widget .email-inpt').val(data.email);
    $('.customer-info-widget .phone-number-inpt').val(data.phoneNumber);
    $('.customer-info-widget .address-1-inpt').val(data.address.addressLineOne);
    $('.customer-info-widget .address-2-inpt').val(data.address.addressLineTwo);
    $('.customer-info-widget .city-inpt').val(data.address.city);
    $('.customer-info-widget .state-inpt').val(data.address.state);
    $('.customer-info-widget .zip-code-inpt').val(data.address.zipCode);
  };

  var addSeatInfo = function addSeatInfo() {
    var data = order.seats;
    data.forEach(function (seat) {
      var appendWrap = '.ga-seats';

      if (vipRows.includes(seat.seat[seat.seat.length - 1])) {
        appendWrap = '.vip-seats';
      }

      $(".seat-info-widget ".concat(appendWrap, " .inputs-wrap")).append("<div class=\"seat-input-wrap\" data-seat=\"".concat(seat.seat, "\"><div class=\"seat-number-wrap\"><p class=\"seat-number\">").concat(seat.seat, "</p></div><input value=\"").concat(seat.name, "\" class=\"seat-name-inpt\" type=\"text\" placeholder=\"First and Last Name\" onkeypress=\"return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32\"/></div>"));
    });

    if ($('.seat-info-widget .ga-seats .inputs-wrap').children().length == 0) {
      $('.seat-info-widget .ga-seats .no-seats').show();
      $('.seat-info-widget .ga-seats .inputs-wrap').hide();
    }

    if ($('.seat-info-widget .vip-seats .inputs-wrap').children().length == 0) {
      $('.seat-info-widget .vip-seats .no-seats').show();
      $('.seat-info-widget .vip-seats .inputs-wrap').hide();
    }
  };

  var addCartInfo = function addCartInfo() {
    var vipSeatAmount = order.seats.filter(function (item) {
      return vipRows.includes(item.seat[item.seat.length - 1]);
    }).length;
    var gaSeatAmount = order.seats.length - vipSeatAmount;
    console.log(vipSeatAmount);
    order.seats.forEach(function (seat) {
      var tempData = {
        price: order.prices.gaSeatPrice / gaSeatAmount,
        seat: seat.seat,
        name: seat.name,
        seatStatus: 'GA'
      };
      var vipIcon = '';

      if (vipRows.includes(tempData.seat[tempData.seat.length - 1])) {
        tempData.price = order.prices.vipSeatPrice / vipSeatAmount;
        tempData.seatStatus = 'VIP';
        vipIcon = '<div class="icon"></div>';
      }

      $('.cart-info-widget .seats-wrap').append("<div class=\"seat-wrap\" data-seat=\"".concat(tempData.seat, "\"><div class=\"seat\">").concat(vipIcon, "</div><div class=\"seat-info\"><p class=\"seat-number\">Seat ").concat(tempData.seat, " - <span class=\"seat-status\">").concat(tempData.seatStatus, "</span></p><p class=\"seat-name\">").concat(tempData.name, "</p></div><p class=\"seat-price\">$").concat(tempData.price, "</p></div>"));
    });
    $('.cart-info-widget .subtotal-wrap .charge').text("$".concat((order.prices.gaSeatPrice + order.prices.vipSeatPrice).toFixed(2)));
    $('.cart-info-widget .fees-wrap .charge').text("$".concat(order.prices.fees.toFixed(2)));
    $('.cart-info-widget .total-price').text("$".concat(order.prices.total.toFixed(2)));
  };

  var addBasicInfo = function addBasicInfo() {
    $('.basic-info-widget .order-id-wrap h1').text(order.orderID.toUpperCase());
    $('.basic-info-widget .purchase-time-wrap h1').text(moment(order.time).format('MMM DD, YYYY LT'));
  };

  var addPaymentInfo = function addPaymentInfo() {};

  var addNotesInfo = function addNotesInfo() {
    if (order.note) {
      $('.notes-info-widget .note').val(order.note);
    }
  };

  var addHistoryInfo = function addHistoryInfo() {};

  $(document).ready(function () {
    addCustomerInfo();
    addSeatInfo();
    addCartInfo();
    addBasicInfo();
    addPaymentInfo();
    addNotesInfo();
    addHistoryInfo();
  });
});

var checkForUpdate = function checkForUpdate() {
  var check = false;

  if ($('.customer-info-widget .first-name-inpt').val() != order.customerInformation.firstName || $('.customer-info-widget .last-name-inpt').val() != order.customerInformation.lastName || $('.customer-info-widget .email-inpt').val() != order.customerInformation.email || $('.customer-info-widget .phone-number-inpt').val() != order.customerInformation.phoneNumber || $('.customer-info-widget .address-1-inpt').val() != order.customerInformation.address.addressLineOne || $('.customer-info-widget .address-2-inpt').val() != order.customerInformation.address.addressLineTwo || $('.customer-info-widget .city-inpt').val() != order.customerInformation.address.city || $('.customer-info-widget .state-inpt').val() != order.customerInformation.address.state || $('.customer-info-widget .zip-code-inpt').val() != order.customerInformation.address.zipCode) {
    check = true;
  }

  order.seats.forEach(function (seat) {
    if (seat.name != $(".seat-info-widget .seat-input-wrap[data-seat=\"".concat(seat.seat, "\"] input")).val()) {
      check = true;
      return;
    }
  });
  console.log(check);

  if (check) {
    $('.update-info-widget .update-info-btn').removeClass('disabled');
    $('.update-info-widget .send-email-wrap').removeClass('hidden');
  } else {
    $('.update-info-widget .send-email-wrap').addClass('hidden');
    $('.update-info-widget .update-info-btn').addClass('disabled');
  }
};

$('.update-info-widget .update-info-btn').click(function () {
  if (!$(this).hasClass('disabled')) {// RUN UPDATE POST FUNCTION
  }
});
$('.update-info-widget .send-email-wrap .checkbox').click(function () {
  $(this).toggleClass('checked');
});
$('.notes-info-widget .note').on('input', function () {
  if ($(this).val() != order.note) {
    $('.notes-info-widget .update-note-btn').removeClass('disabled');
  } else {
    $('.notes-info-widget .update-note-btn').addClass('disabled');
  }
});
$(document).on('input', '.customer-info-widget input, .seat-info-widget input', function () {
  checkForUpdate();
});
//# sourceMappingURL=manage-order.js.map
