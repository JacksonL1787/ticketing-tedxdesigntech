"use strict";

var price = {
  subTotal: 0,
  fees: 0,
  total: 0
};
var vipRows = ['A', 'B', 'C'];

var addCartItems = function addCartItems() {
  window.seatData.seats.forEach(function (item) {
    var tempData = {
      price: window.seatPrices.gaSeats,
      seat: item.seat,
      name: item.name,
      seatStatus: 'GA'
    };
    var vipIcon = '';

    if (vipRows.includes(tempData.seat[tempData.seat.length - 1])) {
      tempData.price = window.seatPrices.vipSeats;
      tempData.seatStatus = 'VIP';
      vipIcon = '<div class="icon"></div>';
    }

    price.subTotal += tempData.price;
    price.fees += window.seatPrices.fees;
    price.total = price.subTotal + price.fees;
    $('.your-cart-info .seats-wrap').append("<div class=\"seat-wrap\" data-seat=\"".concat(tempData.seat, "\"><div class=\"seat\">").concat(vipIcon, "</div><div class=\"seat-info\"><p class=\"seat-number\">Seat ").concat(tempData.seat, " - <span class=\"seat-status\">").concat(tempData.seatStatus, "</span></p><p class=\"seat-name\">").concat(tempData.name, "</p></div><p class=\"seat-price\">$").concat(tempData.price, "</p></div>"));
  });
};

var setPrice = function setPrice() {
  $('.your-cart-info .subtotal-wrap .charge').text("$".concat(price.subTotal));
  $('.your-cart-info .fees-wrap .charge').text("$".concat(price.fees.toFixed(2)));
  $('.your-cart-info .total-price').text("$".concat(price.total.toFixed(2)));
};

$(document).ready(function () {
  addCartItems();
  setPrice();
});
$('.payment .purchase-btn').click(function () {
  $.post({
    url: '/finishOrder',
    success: function success() {
      window.location.href = "/order-complete";
    }
  });
});
$('.go-back-btn').click(function () {
  window.location.href = "/customer/information";
});
//# sourceMappingURL=seat-checkout.js.map
