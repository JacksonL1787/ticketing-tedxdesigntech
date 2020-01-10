"use strict";

var vipRows = ['A', 'B', 'C'];

var hideShippingStatusWraps = function hideShippingStatusWraps() {
  $('.shipping-status-widget .shipping-status-info-wrap').hide();
};

var showTrackingNumberWrap = function showTrackingNumberWrap() {
  hideShippingStatusWraps();
  $('.shipping-status-widget .shipping-add-tracking-number-wrap .tracking-number-inpt').val('');
  $('.shipping-status-widget .shipping-add-tracking-number-wrap').show();
};

var showDeactivatedShippingWrap = function showDeactivatedShippingWrap() {
  hideShippingStatusWraps();
  $('.shipping-status-widget .shipping-deactivated-wrap').show();
};

var showShippingOnWayWrap = function showShippingOnWayWrap() {
  hideShippingStatusWraps();
  $('.shipping-status-widget').addClass('shipped');
  $('.shipping-status-widget .shipping-on-way-wrap').show();
};

$(function () {
  // ADD DATA TO DOCUMENT
  var addCustomerInfo = function addCustomerInfo() {
    $('.customer-info-widget .first-name-inpt').val(order.first_name);
    $('.customer-info-widget .last-name-inpt').val(order.last_name);
    $('.customer-info-widget .email-inpt').val(order.email);
    $('.customer-info-widget .phone-number-inpt').val(order.phone_number);
    $('.customer-info-widget .address-1-inpt').val(order.address_line_one);
    $('.customer-info-widget .address-2-inpt').val(order.address_line_two);
    $('.customer-info-widget .city-inpt').val(order.city);
    $('.customer-info-widget .state-inpt').val(order.state);
    $('.customer-info-widget .zip-code-inpt').val(order.zip_code);
  };

  var addShippingInfo = function addShippingInfo() {
    if (window.order.shipment_status) {
      showShippingOnWayWrap();
      return;
    }

    if (window.order.not_shipping) {
      showDeactivatedShippingWrap();
    } else {
      showTrackingNumberWrap();
    }
  };

  var addSeatInfo = function addSeatInfo() {
    order.seats.forEach(function (seat) {
      var appendWrap = seat.type === "VIP" ? '.vip-seats' : '.ga-seats';
      $(".seat-info-widget ".concat(appendWrap, " .inputs-wrap")).append("<div class=\"seat-input-wrap\" data-seat-id=\"".concat(seat.seat_id, "\" data-seat=\"").concat(seat.name, "\"><div class=\"seat-number-wrap\"><p class=\"seat-number\">").concat(seat.name, "</p></div><input value=\"").concat(seat.attendee_name, "\" class=\"seat-name-inpt\" type=\"text\" placeholder=\"First and Last Name\" onkeypress=\"return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32\"/></div>"));
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
    var price = {
      subTotal: 0,
      fee: 0,
      total: 0
    };
    order.seats.forEach(function (item) {
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
      $('.cart-info-widget .seats-wrap').append("<div class=\"seat-wrap\" data-seat=\"".concat(tempData.seat, "\"><div class=\"seat\">").concat(vipIcon, "</div><div class=\"seat-info\"><p class=\"seat-number\">Seat ").concat(tempData.seat, " - <span class=\"seat-status\">").concat(tempData.seatStatus, "</span></p><p class=\"seat-name\">").concat(tempData.name, "</p></div><p class=\"seat-price\">$").concat(tempData.price, "</p></div>"));
    });
    $('.cart-info-widget .subtotal-wrap .charge').text(price.subTotal === 0 ? "$0.00" : "$".concat(price.subTotal.toFixed(2)));
    $('.cart-info-widget .fees-wrap .charge').text(price.fee === 0 ? "$0.00" : "$".concat(price.fee.toFixed(2)));
    $('.cart-info-widget .total-price').text(parseFloat(window.order.payment_amount) == 0 ? "Free" : "$".concat(parseFloat(window.order.payment_amount).toFixed(2)));

    if (window.order.payment_amount == 0) {
      $('.cart-info-widget .seats-wrap .seat-price').text('$0.00');
      $('.cart-info-widget .subtotal-wrap .charge').text('$0.00');
      $('.cart-info-widget .fees-wrap .charge').text('$0.00');
    }
  };

  var addBasicInfo = function addBasicInfo() {
    $('.basic-info-widget .order-id-wrap h1').text(order.order_code);
    $('.basic-info-widget .purchase-time-wrap h1').text(moment(order.timestamp).format('MMM DD, YYYY LT'));
  };

  var addNotesInfo = function addNotesInfo() {
    if (window.order.order_note) {
      console.log('addNote');
      $('.notes-info-widget .note').val(window.order.order_note);
    }
  };

  $(document).ready(function () {
    addCustomerInfo();
    addSeatInfo();
    addCartInfo();
    addBasicInfo();
    addNotesInfo();
    addShippingInfo();
  });
});

var checkForUpdate = function checkForUpdate() {
  var check = false;

  if ($('.customer-info-widget .first-name-inpt').val() != order.first_name || $('.customer-info-widget .last-name-inpt').val() != order.last_name || $('.customer-info-widget .email-inpt').val() != order.email || $('.customer-info-widget .phone-number-inpt').val() != order.phone_number || $('.customer-info-widget .address-1-inpt').val() != order.address_line_one || $('.customer-info-widget .address-2-inpt').val() != order.address_line_two || $('.customer-info-widget .city-inpt').val() != order.city || $('.customer-info-widget .state-inpt').val() != order.state || $('.customer-info-widget .zip-code-inpt').val() != order.zip_code) {
    check = true;
  }

  order.seats.forEach(function (seat) {
    if (seat.attendee_name != $(".seat-info-widget .seat-input-wrap[data-seat=\"".concat(seat.name, "\"] input")).val()) {
      check = true;
      return;
    }
  });

  if (check) {
    $('.update-info-widget .send-email-wrap .checkbox').removeClass('checked');
    $('.update-info-widget .update-info-btn').removeClass('disabled');
    $('.update-info-widget .send-email-wrap').removeClass('hidden');
  } else {
    $('.update-info-widget .send-email-wrap').addClass('hidden');
    $('.update-info-widget .update-info-btn').addClass('disabled');
  }
};

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

var createMessage = function createMessage(text) {
  var msg = $("<div class=\"message-wrap\"><div class=\"content\"><div class=\"icon\"></div><p class=\"message\">".concat(text, "</p></div></div>"));
  $('.confirm-message-container').prepend(msg);
  setTimeout(function () {
    $(msg).remove();
  }, 5000);
};

$(function () {
  var check;

  var noteUpdating = function noteUpdating() {
    $('.notes-info-widget .note-status-loader').addClass('show');
    $('.notes-info-widget .note-status-updated').removeClass('show');
  };

  var noteUpdated = function noteUpdated() {
    $('.notes-info-widget .note-status-loader').removeClass('show');
    $('.notes-info-widget .note-status-updated').addClass('show');
  };

  $('.notes-info-widget .note').on('input', function () {
    noteUpdating();
    clearTimeout(check);
    check = setTimeout(function () {
      noteUpdated();
      $.ajax({
        type: "POST",
        url: "/admin/api/updateOrderNote",
        data: {
          orderId: window.order.order_id,
          note: $('.notes-info-widget .note').val()
        }
      });
    }, 650);
  });
});
$(document).on('input', '.customer-info-widget input, .seat-info-widget input', function () {
  checkForUpdate();
});
$('.update-info-widget .update-info-btn').click(function () {
  if (!$(this).hasClass('disabled')) {
    var data = {
      orderId: window.order.order_id,
      first_name: $('.customer-info-widget .first-name-inpt').val(),
      last_name: $('.customer-info-widget .last-name-inpt').val(),
      email: $('.customer-info-widget .email-inpt').val(),
      phone_number: $('.customer-info-widget .phone-number-inpt').val(),
      address_line_one: $('.customer-info-widget .address-1-inpt').val(),
      address_line_two: $('.customer-info-widget .address-2-inpt').val(),
      city: $('.customer-info-widget .city-inpt').val(),
      state: $('.customer-info-widget .state-inpt').val(),
      zip_code: $('.customer-info-widget .zip-code-inpt').val(),
      seats: [],
      sendEmail: $('.update-info-widget .checkbox').hasClass('checked') ? true : false
    };
    $('.seat-info-widget .seat-input-wrap').each(function () {
      data.seats.push({
        name: $(this).data('seat'),
        attendee_name: $(this).children('input').val(),
        id: $(this).data('seat-id')
      });
    });
    $.ajax({
      type: 'post',
      url: '/admin/api/updateOrderInfo',
      data: data,
      success: function success() {
        createMessage('Information has been successfully updated');
        window.order.first_name = data.first_name;
        window.order.last_name = data.last_name;
        window.order.email = data.email;
        window.order.phone_number = data.phone_number;
        window.order.address_line_one = data.address_line_one;
        window.order.address_line_two = data.address_line_two;
        window.order.city = data.city;
        window.order.state = data.state;
        window.order.zip_code = data.zip_code;
        window.order.seats.forEach(function (s) {
          data.seats.forEach(function (st) {
            if (st.id === s.seat_id) {
              s.attendee_name = st.attendee_name;
            }
          });
        });
        checkForUpdate();
      }
    });
  }
});
$(function () {
  var shippingStatusButtonClicks = 0;
  $('.shipping-status-widget .deactivate-shipping-btn').click(function () {
    shippingStatusButtonClicks++;

    if (shippingStatusButtonClicks >= 2) {
      shippingStatusButtonClicks = 0;
      $.ajax({
        url: '/admin/api/deactivateShipping',
        type: 'post',
        data: {
          orderId: window.order.order_id
        },
        success: function success() {
          createMessage('Shipping has been deactivated for this order');
          showDeactivatedShippingWrap();
        }
      });
    }
  });
  $('.shipping-status-widget .activate-shipping-btn').click(function () {
    shippingStatusButtonClicks++;

    if (shippingStatusButtonClicks >= 2) {
      shippingStatusButtonClicks = 0;
      $.ajax({
        url: '/admin/api/activateShipping',
        type: 'post',
        data: {
          orderId: window.order.order_id
        },
        success: function success() {
          createMessage('Shipping has been activated for this order');
          showTrackingNumberWrap();
        }
      });
    }
  });
  $('.shipping-status-widget .tracking-number-inpt').on('input', function () {
    if ($(this).val().replace(' ', '').length > 0) {
      $('.shipping-status-widget .confirm-tracking-number').removeClass('disabled');
    } else {
      $('.shipping-status-widget .confirm-tracking-number').addClass('disabled');
    }
  });
  $('.shipping-status-widget .confirm-tracking-number').click(function () {
    if (!$(this).hasClass('disabled')) {
      $.ajax({
        url: '/admin/api/addTrackingNumber',
        type: 'post',
        data: {
          orderId: window.order.order_id,
          trackingNumber: $('.shipping-status-widget .tracking-number-inpt').val(),
          order_code: window.order.order_code,
          user: {
            first_name: window.order.first_name,
            email: window.order.email
          }
        },
        success: function success() {
          createMessage('Tracking number has been succesfully added');
          window.order.tracking_number = $('.shipping-status-widget .tracking-number-inpt').val();
          showShippingOnWayWrap();
        }
      });
    }
  });
  $('.shipping-status-widget .track-package-btn').click(function () {
    window.open("https://www.ups.com/track?tracknum=".concat(window.order.shipment_tracking_number), '_blank');
  });
});
//# sourceMappingURL=manage-order.js.map
