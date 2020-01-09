"use strict";

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

var addSeatInfo = function addSeatInfo() {};

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
});
//# sourceMappingURL=order-information.js.map
