"use strict";

var gaSeatTotal = 270;
var vipSeatTotal = 90;

var getSeatTotals = function getSeatTotals() {
  var vipSeatsSold = 0;
  var gaSeatsSold = 0;
  window.orders.forEach(function (item) {
    item.seats.forEach(function (seat) {
      if (seat.type == "VIP") {
        vipSeatsSold++;
      } else {
        gaSeatsSold++;
      }
    });
  });
  return {
    vipSeatsSold: vipSeatsSold,
    gaSeatsSold: gaSeatsSold
  };
};

$(function () {
  // Set Seats Sold Data Widgets
  var setVIPSeats = function setVIPSeats(vipSeatsSold) {
    var percent = vipSeatsSold / vipSeatTotal * 100;
    var offset = 628.318530718 - percent / 100 * 628.318530718;
    var rotation = 360 * (percent / 100);
    $('.vip-seats-sold-widget .seats-sold').text(vipSeatsSold);
    $('.vip-seats-sold-widget .seats-left').text(vipSeatTotal - vipSeatsSold);
    $('.vip-seats-sold-widget .g2').css('stroke-dashoffset', offset);
    $('.vip-seats-sold-widget .marker').css('transform', "rotate(".concat(rotation, "deg)"));
  };

  var setGASeats = function setGASeats(gaSeatsSold) {
    var percent = gaSeatsSold / gaSeatTotal * 100;
    var offset = 628.318530718 - percent / 100 * 628.318530718;
    var rotation = 360 * (percent / 100);
    $('.ga-seats-sold-widget .seats-sold').text(gaSeatsSold);
    $('.ga-seats-sold-widget .seats-left').text(gaSeatTotal - gaSeatsSold);
    $('.ga-seats-sold-widget .g2').css('stroke-dashoffset', offset);
    $('.ga-seats-sold-widget .marker').css('transform', "rotate(".concat(rotation, "deg)"));
  };

  $(document).ready(function () {
    setVIPSeats(getSeatTotals().vipSeatsSold);
    setGASeats(getSeatTotals().gaSeatsSold);
  });
});
$(function () {
  // Set Info Widgets
  var getWeeksRevenue = function getWeeksRevenue() {
    var revenue = 0;
    window.orders.forEach(function (order) {
      if (order.timestamp - (Date.now() - 604800000) > 0) {
        revenue += parseFloat(order.payment_amount);
      }
    });
    return revenue.toFixed(2);
  };

  var getGARevenue = function getGARevenue() {
    var revenue = 0;
    window.orders.forEach(function (order) {
      order.seats.forEach(function (seat) {
        if (seat.type != "VIP") {
          revenue += parseFloat(seat.price) + parseFloat(seat.fee);
        }
      });
    });
    return revenue.toFixed(2);
  };

  var getVIPRevenue = function getVIPRevenue() {
    var revenue = 0;
    window.orders.forEach(function (order) {
      order.seats.forEach(function (seat) {
        if (seat.type === "VIP") {
          revenue += parseFloat(seat.price) + parseFloat(seat.fee);
        }
      });
    });
    return revenue.toFixed(2);
  };

  $(document).ready(function () {
    $('.info-widgets .ga-revenue-widget .info').text("$".concat(getGARevenue()));
    $('.info-widgets .vip-revenue-widget .info').text("$".concat(getVIPRevenue()));
    $('.info-widgets .number-of-orders-widget .info').text(window.orders.length);
    $('.info-widgets .this-weeks-earnings-widget .info').text("$".concat(getWeeksRevenue()));
  });
}); // $(function() { // Set Prices Widget
//   $(document).ready(function() {
//     $('.seat-prices-widget .ga-seat-price .price-inpt').val(window.seatPrices.gaSeats.toFixed(2))
//     $('.seat-prices-widget .vip-seat-price .price-inpt').val(window.seatPrices.vipSeats.toFixed(2))
//     $('.seat-prices-widget .fees-price .price-inpt').val(window.seatPrices.fees.toFixed(2))
//   })
// })
//
// $('.seat-prices-widget .price-inpt').on('input', function(e) {
//   console.log(e)
// })
//
// $('.seat-prices-widget .add-btn').click(function() {
//   let input = $(this).siblings('.price-inpt')
//   input.val((parseFloat(input.val()) + 1).toFixed(2))
// })
//
// $('.seat-prices-widget .minus-btn').click(function() {
//   let input = $(this).siblings('.price-inpt')
//   if(parseFloat(input.val()) - 1 >= 0) {
//     input.val((parseFloat(input.val()) - 1).toFixed(2))
//   }
// })
//
// $('.seat-prices-widget .update-prices').click(function() {
//   let data = {
//     gaSeats: parseFloat($('.seat-prices-widget .ga-seat-price .price-inpt').val()),
//     vipSeats: parseFloat($('.seat-prices-widget .vip-seat-price .price-inpt').val()),
//     fees: parseFloat($('.seat-prices-widget .fees-price .price-inpt').val())
//   }
//   $.ajax({
//     url: '/admin/setSeatPrices',
//     type: 'post',
//     data: data,
//     success: function() {
//       window.location.reload()
//     }
//   })
// })

$(document).on('click', '.recent-orders .action-btn', function () {
  window.location.href = "/admin/manage-order/".concat($(this).attr('data-order'));
});
$(function () {
  $(document).ready(function () {
    if (window.orders.length === 0) return $('.recent-orders .no-recent-orders').show();
    window.orders.forEach(function (item, index) {
      if (index >= 5) {
        return false;
      }

      var orderData = item;
      var seatsHTML = "";
      var price = 0;
      orderData.seats.forEach(function (seat) {
        seatsHTML += "<p class=\"pill\">".concat(seat.name, "</p>");
      });
      $('.recent-orders table tbody').append("<tr><td><p class=\"customer-info\">".concat(orderData.first_name, " ").concat(orderData.last_name, "</p></td><td><p class=\"date-info\">").concat(moment(orderData.timestamp).format('MMM DD, YYYY'), "</p></td><td><p class=\"price-info\">").concat(orderData.payment_amount == 0 ? 'Free' : '$' + parseFloat(orderData.payment_amount).toFixed(2), "</p></td><td><div class=\"pill-flex-wrap\">").concat(seatsHTML, "</td><td><div class=\"action-btn\" data-order=\"").concat(orderData.order_id, "\"><div class=\"icon\"></div></div></td></tr>"));
    });
  });
});
//# sourceMappingURL=dashboard.js.map
