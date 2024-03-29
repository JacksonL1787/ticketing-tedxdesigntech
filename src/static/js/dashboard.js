let gaSeatTotal = 270;
let vipSeatTotal = 90;

const getSeatTotals = () => {
  let vipSeatsSold = 0;
  let gaSeatsSold = 0;
  window.orders.forEach(function(item) {
    item.seats.forEach(function(seat) {
      if (seat.type == "VIP") {
        vipSeatsSold++;
      } else {
        gaSeatsSold++;
      }
    });
  });
  return { vipSeatsSold: vipSeatsSold, gaSeatsSold: gaSeatsSold };
};

$(function() {
  // Set Seats Sold Data Widgets
  const setVIPSeats = vipSeatsSold => {
    let percent = (vipSeatsSold / vipSeatTotal) * 100;
    const offset = 628.318530718 - (percent / 100) * 628.318530718;
    const rotation = 360 * (percent / 100);
    $(".vip-seats-sold-widget .seats-sold").text(vipSeatsSold);
    $(".vip-seats-sold-widget .seats-left").text(vipSeatTotal - vipSeatsSold);
    $(".vip-seats-sold-widget .g2").css("stroke-dashoffset", offset);
    $(".vip-seats-sold-widget .marker").css(
      "transform",
      `rotate(${rotation}deg)`
    );
  };

  const setGASeats = gaSeatsSold => {
    let percent = (gaSeatsSold / gaSeatTotal) * 100;
    const offset = 628.318530718 - (percent / 100) * 628.318530718;
    const rotation = 360 * (percent / 100);
    $(".ga-seats-sold-widget .seats-sold").text(gaSeatsSold);
    $(".ga-seats-sold-widget .seats-left").text(gaSeatTotal - gaSeatsSold);
    $(".ga-seats-sold-widget .g2").css("stroke-dashoffset", offset);
    $(".ga-seats-sold-widget .marker").css(
      "transform",
      `rotate(${rotation}deg)`
    );
  };

  $(document).ready(function() {
    setVIPSeats(getSeatTotals().vipSeatsSold);
    setGASeats(getSeatTotals().gaSeatsSold);
  });
});

$(function() {
  // Set Info Widgets

  const getWeeksRevenue = () => {
    let revenue = 0;
    window.orders.forEach(function(order) {
      if (order.timestamp - (Date.now() - 604800000) > 0) {
        revenue += parseFloat(order.payment_amount);
      }
    });
    return revenue.toFixed(2);
  };

  const getGARevenue = () => {
    let revenue = 0;
    window.orders.forEach(function(order) {
      order.seats.forEach(function(seat) {
        if (seat.type != "VIP") {
          revenue +=
            parseFloat(order.payment_amount) === 0
              ? 0
              : parseFloat(seat.price) + parseFloat(seat.fee);
        }
      });
    });
    return revenue.toFixed(2);
  };

  const getVIPRevenue = () => {
    let revenue = 0;
    window.orders.forEach(function(order) {
      order.seats.forEach(function(seat) {
        if (seat.type === "VIP") {
          revenue +=
            parseFloat(order.payment_amount) === 0
              ? 0
              : parseFloat(seat.price) + parseFloat(seat.fee);
        }
      });
    });
    return revenue.toFixed(2);
  };

  $(document).ready(function() {
    $(".info-widgets .ga-revenue-widget .info").text(`$${getGARevenue()}`);
    $(".info-widgets .vip-revenue-widget .info").text(`$${getVIPRevenue()}`);
    $(".info-widgets .number-of-orders-widget .info").text(
      window.orders.length
    );
    $(".info-widgets .this-weeks-earnings-widget .info").text(
      `$${getWeeksRevenue()}`
    );
  });
});

// $(function() { // Set Prices Widget
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

$(document).on("click", ".recent-orders .action-btn", function() {
  window.location.href = `/admin/manage-order/${$(this).attr("data-order")}`;
});

$(function() {
  $(document).ready(function() {
    if (window.orders.length === 0)
      return $(".recent-orders .no-recent-orders").show();
    window.orders.forEach(function(item, index) {
      if (index >= 5) {
        return false;
      }
      let orderData = item;
      let seatsHTML = "";
      let price = 0;
      orderData.seats.forEach(function(seat) {
        seatsHTML += `<p class="pill">${seat.name}</p>`;
      });
      $(".recent-orders table tbody").append(
        `<tr><td><p class="customer-info">${orderData.first_name} ${
          orderData.last_name
        }</p></td><td><p class="date-info">${moment(orderData.timestamp).format(
          "MMM DD, YYYY"
        )}</p></td><td><p class="price-info">${
          orderData.payment_amount == 0
            ? "Free"
            : "$" + parseFloat(orderData.payment_amount).toFixed(2)
        }</p></td><td><div class="pill-flex-wrap">${seatsHTML}</td><td><div class="action-btn" data-order="${
          orderData.order_id
        }"><div class="icon"></div></div></td></tr>`
      );
    });
  });
});
