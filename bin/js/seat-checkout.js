"use strict";

var price = {
  subTotal: 0,
  fee: 0,
  total: 0
};
var stripe = Stripe('pk_test_OnZ7dgb1twqWB2XAjquTPtTL00BGDKrbP1');

var addCartItems = function addCartItems() {
  window.seatData.forEach(function (item) {
    var tempData = {
      price: item.price,
      seat: item.name,
      name: item.attendee_name,
      seatStatus: item.type,
      fee: item.fee
    };
    var vipIcon = item.type === "VIP" ? '<div class="icon"></div>' : '';
    price.subTotal += parseFloat(tempData.price);
    price.fee += parseFloat(item.fee);
    price.total = price.subTotal + price.fee;
    $('.your-cart-info .seats-wrap').append("<div class=\"seat-wrap\" data-seat=\"".concat(tempData.seat, "\"><div class=\"seat\">").concat(vipIcon, "</div><div class=\"seat-info\"><p class=\"seat-number\">Seat ").concat(tempData.seat, " - <span class=\"seat-status\">").concat(tempData.seatStatus, "</span></p><p class=\"seat-name\">").concat(tempData.name, "</p></div><p class=\"seat-price\">$").concat(tempData.price, "</p></div>"));
  });
};

var setPrice = function setPrice() {
  $('.your-cart-info .subtotal-wrap .charge').text("$".concat(price.subTotal.toFixed(2)));
  $('.your-cart-info .fees-wrap .charge').text("$".concat(price.fee.toFixed(2)));
  $('.your-cart-info .total-price').text("$".concat(price.total.toFixed(2)));
};

var failMessage = function failMessage() {
  var msg = $("<div class=\"message-wrap\"><div class=\"message-content\"><div class=\"icon\"></div><p class=\"message\">Your order payment failed.</p></div></div>");
  $('.message-container').prepend(msg);
  setTimeout(function () {
    $(msg).remove();
  }, 7000);
};

$(document).ready(function () {
  addCartItems();
  setPrice();

  if (window.message === "checkoutFail") {
    failMessage();
  }
});
$('.payment .purchase-btn').click(function () {
  $.get({
    url: '/api/stripe/checkoutSession',
    success: function success(sessionId) {
      stripe.redirectToCheckout({
        sessionId: sessionId
      });
    }
  });
});
$('.go-back-btn').click(function () {
  window.location.href = "/seats/information";
});
//# sourceMappingURL=seat-checkout.js.map
