"use strict";

var hideShippingStatuses = function hideShippingStatuses() {
  $('.shipping-status-widget .shipment-status').hide();
};

var showShipmentNotSent = function showShipmentNotSent() {
  hideShippingStatuses();
  $('.shipping-status-widget .not-shipped').show();
};

var showShipmentCancelled = function showShipmentCancelled() {
  hideShippingStatuses();
  $('.shipping-status-widget .shipping-cancelled-wrap').show();
};

var showShipmentSent = function showShipmentSent() {
  hideShippingStatuses();
  $('.shipping-status-widget .tickets-shipping-wrap').show();
};

var addBasicInfo = function addBasicInfo() {
  $('.basic-info-widget .order-code').text("#".concat(window.order.order_code));
  $('.basic-info-widget .time-of-purchase').text(moment(window.order.timestamp).format('MMM DD, YYYY LT'));
};

var addCustomerDetails = function addCustomerDetails() {
  $('.customer-details-widget .first-name').text("".concat(window.order.first_name || 'None'));
  $('.customer-details-widget .last-name').text("".concat(window.order.last_name || 'None'));
  $('.customer-details-widget .email').text("".concat(window.order.email || 'None'));
  $('.customer-details-widget .phone-number').text("".concat(window.order.phone_number || 'None'));
  $('.customer-details-widget .address-line-one').text("".concat(window.order.address_line_one || 'None'));
  $('.customer-details-widget .address-line-two').text("".concat(window.order.address_line_two || 'None'));
  $('.customer-details-widget .city').text("".concat(window.order.city || 'None'));
  $('.customer-details-widget .state').text("".concat(window.order.state || 'None'));
  $('.customer-details-widget .zip-code').text("".concat(window.order.zip_code || 'None'));
};

var updateShipmentStatus = function updateShipmentStatus() {
  if (window.order.shipment_status) {
    showShipmentSent();
    return;
  }

  if (window.order.not_shipping) {
    showShipmentCancelled();
  } else {
    showShipmentNotSent();
  }
};

var addSeatInfo = function addSeatInfo() {
  var price = {
    subTotal: 0,
    fee: 0,
    total: 0
  };
  window.order.seats.forEach(function (item) {
    var vipIcon = item.type === "VIP" ? '<div class="icon"></div>' : '';
    price.subTotal += parseFloat(item.price);
    price.fee += parseFloat(item.fee);
    price.total = price.subTotal + price.fee;
    $('.seat-info-widget .seats-wrap').append("<div class=\"seat-wrap\"><div class=\"seat\">".concat(vipIcon, "</div><div class=\"seat-info\"><p class=\"seat-number\">Seat ").concat(item.name, " - <span class=\"seat-status\">").concat(item.type, "</span></p><p class=\"seat-name\">").concat(item.attendee_name, "</p></div><p class=\"seat-price\">$").concat(item.price, "</p></div>"));
  });
  $('.seat-info-widget .subtotal-wrap .charge').text(price.subTotal === 0 ? "Free" : "$".concat(price.subTotal.toFixed(2)));
  $('.seat-info-widget .fees-wrap .charge').text(price.fee === 0 ? "Free" : "$".concat(price.fee.toFixed(2)));
  $('.seat-info-widget .total-price').text(parseFloat(window.order.payment_amount) == 0 ? "Free" : "$".concat(parseFloat(window.order.payment_amount).toFixed(2)));

  if (window.order.payment_amount == 0) {
    $('.seat-info-widget .seats-wrap .seat-price').text('$0.00');
    $('.seat-info-widget .subtotal-wrap .charge').text('$0.00');
    $('.seat-info-widget .fees-wrap .charge').text('$0.00');
  }
};

var addShippingStatus = function addShippingStatus() {};

$(document).ready(function () {
  if (!window.order) {
    $('.not-valid-wrap').show();
    return;
  }

  $('.layout, .top').show();
  $('.top .page-title').text("Order #".concat(window.order.order_code));
  addBasicInfo();
  addCustomerDetails();
  addSeatInfo();
  addShippingStatus();
  updateShipmentStatus();
});
$('.shipping-status-widget .track-tickets-btn').click(function () {
  window.open("https://www.ups.com/track?tracknum=".concat(window.order.shipment_tracking_number), '_blank');
});
//# sourceMappingURL=order-information.js.map
