"use strict";

var checkIfOrders = function checkIfOrders() {
  if ($('.orders-table .hidden').length == $('.orders-table .order').length || $('.orders-table .order').length == 0) {
    $('.no-orders').show();
  } else {
    $('.no-orders').hide();
  }
};

$(function () {
  $(document).ready(function () {
    window.orders.forEach(function (item, index) {
      item = window.orders[window.orders.length - 1 - index];
      console.log(item);
      var seatsHTML = '';
      item.seats.forEach(function (seatItem) {
        seatsHTML += "<p class=\"pill\">".concat(seatItem.seat, "</p>");
      });
      $('.orders-table table tbody').append("\n        <tr class=\"order\">\n          <td>\n            <p class=\"order-id-info\">".concat(item.orderID, "</p>\n          </td>\n\n          <td>\n            <p class=\"customer-name-info\">").concat(item.customerInformation.firstName, " ").concat(item.customerInformation.lastName, "</p>\n          </td>\n\n          <td>\n            <p class=\"customer-email-info\">").concat(item.customerInformation.email, "</p>\n          </td>\n\n          <td>\n            <p class=\"date-info\" data-time=\"").concat(item.time, "\">").concat(moment(item.time).format('MMM DD, YYYY'), "</p>\n          </td>\n\n          <td>\n            <p class=\"price-info\">").concat(item.prices.total == 0 ? 'Free' : '$' + item.prices.total.toFixed(2), "</p>\n          </td>\n\n          <td>\n            <div class=\"pill-flex-wrap\">").concat(seatsHTML, "\n          </td>\n\n          <td>\n            <div class=\"action-btn\" data-order-id=\"").concat(item.orderID, "\">\n              <div class=\"icon\"></div>\n            </div>\n          </td>\n        </tr>"));
    });
    checkIfOrders();
  });
});
$('.search-wrap .search-bar').on('input', function () {
  var val = $(this).val().toLowerCase();
  $('.orders-table .order').each(function () {
    var seats = [];
    $(this).find('.pill').each(function () {
      seats.push($(this).text());
    });
    console.log();

    if ($(this).find('.order-id-info').text().toLowerCase().startsWith(val) || $(this).find('.customer-name-info').text().toLowerCase().startsWith(val) || $(this).find('.customer-email-info').text().toLowerCase().startsWith(val) || seats.includes(val.toUpperCase())) {
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
  checkIfOrders();
});
$('.filter-bar .filter-option').click(function () {
  $('.filter-bar .filter-option').removeClass('active');
  $(this).addClass('active');
  var time;

  if ($(this).hasClass('today-filter')) {
    time = 86400000;
  } else if ($(this).hasClass('week-filter')) {
    time = 604800000;
  } else if ($(this).hasClass('month-filter')) {
    time = 2592000000;
  } else {
    $('.orders-table .order').removeClass('hidden');
    return;
  }

  $('.orders-table .order').each(function () {
    console.log('test');

    if (parseInt($(this).find('.date-info').attr('data-time')) - (Date.now() - time) >= 0) {
      $(this).removeClass('hidden');
    } else {
      $(this).addClass('hidden');
    }
  });
  checkIfOrders();
});
$(document).on('click', '.order .action-btn', function () {
  window.location.href = "/admin/manage-order/".concat($(this).attr('data-order-id'));
});
//# sourceMappingURL=orders.js.map
