let price = {
  subTotal: 0,
  fee: 0,
  total: 0
};
const stripe = Stripe("pk_test_OnZ7dgb1twqWB2XAjquTPtTL00BGDKrbP1");

const addCartItems = () => {
  window.seatData.forEach(item => {
    let tempData = {
      price: item.price,
      seat: item.name,
      name: item.attendee_name,
      seatStatus: item.type,
      fee: item.fee
    };
    let vipIcon = item.type === "VIP" ? '<div class="icon"></div>' : "";
    price.subTotal += parseFloat(tempData.price);
    price.fee += parseFloat(item.fee);
    price.total = price.subTotal + price.fee;
    $(".your-cart-info .seats-wrap").append(
      `<div class="seat-wrap" data-seat="${tempData.seat}"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${tempData.seat} - <span class="seat-status">${tempData.seatStatus}</span></p><p class="seat-name">${tempData.name}</p></div><p class="seat-price">$${tempData.price}</p></div>`
    );
  });
};

const setPrice = () => {
  $(".your-cart-info .subtotal-wrap .charge").text(
    `$${price.subTotal.toFixed(2)}`
  );
  $(".your-cart-info .fees-wrap .charge").text(`$${price.fee.toFixed(2)}`);
  $(".your-cart-info .total-price").text(`$${price.total.toFixed(2)}`);
};

const failMessage = () => {
  let msg = $(
    `<div class="message-wrap"><div class="message-content"><div class="icon"></div><p class="message">Your order payment failed.</p></div></div>`
  );
  $(".message-container").prepend(msg);
  setTimeout(() => {
    $(msg).remove();
  }, 7000);
};

$(document).ready(function() {
  addCartItems();
  setPrice();
  if (window.message === "checkoutFail") {
    failMessage();
  }
});

$(".payment .purchase-btn").click(function() {
  $.get({
    url: "/api/stripe/checkoutSession",
    success: function(sessionId) {
      stripe.redirectToCheckout({ sessionId });
    }
  });
});

$(".go-back-btn").click(() => {
  window.location.href = "/seats/information";
});
