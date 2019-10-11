"use strict";

var overview = {
  seats: [],
  price: 0
};
var seatsPerRow = 30;
var vipRows = ['A', 'B', 'C'];
var rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

var createSeats = function createSeats() {
  for (var i = 1; i <= rowNames.length; i++) {
    console.log(i);
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

    $('.seat-wrap').append("<div class=\"row row".concat(i, "\"><div class=\"column1 column\">").concat(column1.join(""), "</div><p class=\"row-letter\">").concat(rowNames[i - 1], "</p><div class=\"column2 column\">").concat(column2.join(""), "</div></div>"));
  }
};

var markTakenSeats = function markTakenSeats() {
  if (window.takenSeats) {
    window.takenSeats.forEach(function (item) {
      $(".seat-wrap .seat[data-seat=\"".concat(item, "\"]")).addClass('taken').removeClass('available');
    });
  }
};

var setPrice = function setPrice(change) {
  overview.price += change;

  if (overview.price <= 0) {
    $('.purchase-wrap .next-step').addClass('disabled');
    $('.purchase-wrap p.total').text('No Tickets Selected');
  } else {
    $('.purchase-wrap .next-step').removeClass('disabled');
    $('.purchase-wrap p.total').html("Total: <span class=\"total-price\">$".concat(overview.price, "+ Fees</span>"));
  }
};

var addSeatInfo = function addSeatInfo(seat, price) {
  $('.overview-wrap .seats-wrap').append("<div class=\"seat-number-wrap\"><p class=\"seat-price\">$".concat(price, "</p><p class=\"seat-number\">").concat(seat, "</p></div>"));
};

var removeSeatInfo = function removeSeatInfo(seat) {
  var seatNum = seat;
  $('.overview-wrap .seats-wrap .seat-number-wrap').each(function () {
    if ($(this).children('.seat-number').text() == seatNum) {
      $(this).remove();
      return;
    }
  });
};

var selectSeat = function selectSeat(seat) {
  overview.seats.push(seat.attr('data-seat'));
  var number;
  $('.seats-wrap .none-selected').hide();

  if (seat.hasClass('vip-seat')) {
    number = parseInt($('.vip-tickets-wrap .number-of-tickets .number').text()) + 1;
    $('.vip-tickets-wrap .number-of-tickets .number').text(number);
    setPrice(parseFloat(window.seatPrices.VIP.price));
    addSeatInfo(seat.attr('data-seat'), window.seatPrices.VIP.price);
  } else {
    number = parseInt($('.ga-tickets-wrap .number-of-tickets .number').text()) + 1;
    $('.ga-tickets-wrap .number-of-tickets .number').text(number);
    setPrice(parseFloat(window.seatPrices.GA.price));
    addSeatInfo(seat.attr('data-seat'), window.seatPrices.GA.price);
  }
};

var removeSeat = function removeSeat(seat) {
  overview.seats.splice(overview.seats.indexOf(seat.attr('data-seat')), 1);

  if (overview.seats.length == 0) {
    $('.seats-wrap .none-selected').show();
  }

  var number;
  removeSeatInfo(seat.attr('data-seat'));

  if (seat.hasClass('vip-seat')) {
    number = parseInt($('.vip-tickets-wrap .number-of-tickets .number').text()) - 1;
    $('.vip-tickets-wrap .number-of-tickets .number').text(number);
    setPrice(-parseFloat(window.seatPrices.VIP.price));
  } else {
    number = parseInt($('.ga-tickets-wrap .number-of-tickets .number').text()) - 1;
    $('.ga-tickets-wrap .number-of-tickets .number').text(number);
    setPrice(-parseFloat(window.seatPrices.GA.price));
  }
};

var selectCurrentSeats = function selectCurrentSeats() {
  if (window.seatData) {
    window.seatData.seats.forEach(function (item) {
      var newDiv = document.createElement('div');
      newDiv.setAttribute('data-seat', item.seat);

      if (vipRows.includes(item.seat[item.seat.length - 1])) {
        newDiv.setAttribute('class', 'vip-seat');
      }

      $(".seat-wrap .seat[data-seat=\"".concat(item.seat, "\"]")).addClass('selected');
      selectSeat($(newDiv));
    });
  }
};

$(document).on('click', '.seat', function () {
  if (!$(this).hasClass('taken')) {
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
      removeSeat($(this));
    } else {
      $(this).addClass('selected');
      selectSeat($(this));
    }
  }
});
$(document).ready(function () {
  createSeats();
  selectCurrentSeats();
  markTakenSeats();
});
$('.next-step').click(function () {
  if (!$(this).hasClass('disabled')) {
    var data = {
      seats: overview.seats
    };
    $.post({
      url: "/createOrder",
      data: data
    });
  }
});
//# sourceMappingURL=seat-selection.js.map
