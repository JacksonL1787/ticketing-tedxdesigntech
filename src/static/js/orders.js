let checkIfOrders = () => {
  if (
    $(".orders-table .hidden").length == $(".orders-table .order").length ||
    $(".orders-table .order").length == 0
  ) {
    $(".no-orders").show();
  } else {
    $(".no-orders").hide();
  }
};

$(function() {
  $(document).ready(function() {
    window.orders.forEach(function(item, index) {
      console.log(item);
      let seatsHTML = "";
      item.seats.forEach(function(seatItem) {
        seatsHTML += `<p class="pill">${seatItem.name}</p>`;
      });
      item.payment_amount = parseFloat(item.payment_amount);
      $(".orders-table table tbody").append(`
        <tr class="order">
          <td>
            <p class="order-id-info">${item.order_code}</p>
          </td>

          <td>
            <p class="customer-name-info">${
              item.first_name
            } ${item.last_name}</p>
          </td>

          <td>
            <p class="customer-email-info">${item.email}</p>
          </td>

          <td>
            <p class="date-info" data-time="${
              item.timestamp
            }">${moment(item.timestamp).format("MMM DD, YYYY")}</p>
          </td>

          <td>
            <p class="price-info">${
              item.payment_amount == 0
                ? "Free"
                : "$" + item.payment_amount.toFixed(2)
            }</p>
          </td>

          <td>
            <div class="pill-flex-wrap">${seatsHTML}
          </td>

          <td>
            <div class="action-btn" data-order-id="${item.order_id}">
              <div class="icon"></div>
            </div>
          </td>
        </tr>`);
    });
    checkIfOrders();
  });
});

$(".search-wrap .search-bar").on("input", function() {
  let val = $(this)
    .val()
    .toLowerCase();
  $(".orders-table .order").each(function() {
    let seats = [];
    $(this)
      .find(".pill")
      .each(function() {
        seats.push($(this).text());
      });
    console.log();
    if (
      $(this)
        .find(".order-id-info")
        .text()
        .toLowerCase()
        .startsWith(val) ||
      $(this)
        .find(".customer-name-info")
        .text()
        .toLowerCase()
        .startsWith(val) ||
      $(this)
        .find(".customer-email-info")
        .text()
        .toLowerCase()
        .startsWith(val) ||
      seats.includes(val.toUpperCase())
    ) {
      $(this).removeClass("hidden");
    } else {
      $(this).addClass("hidden");
    }
  });
  checkIfOrders();
});

$(".filter-bar .filter-option").click(function() {
  $(".filter-bar .filter-option").removeClass("active");
  $(this).addClass("active");
  let time;
  if ($(this).hasClass("today-filter")) {
    time = 86400000;
  } else if ($(this).hasClass("week-filter")) {
    time = 604800000;
  } else if ($(this).hasClass("month-filter")) {
    time = 2592000000;
  } else {
    $(".orders-table .order").removeClass("hidden");
    return;
  }
  $(".orders-table .order").each(function() {
    console.log("test");
    if (
      parseInt(
        $(this)
          .find(".date-info")
          .attr("data-time")
      ) -
        (Date.now() - time) >=
      0
    ) {
      $(this).removeClass("hidden");
    } else {
      $(this).addClass("hidden");
    }
  });
  checkIfOrders();
});

$(document).on("click", ".order .action-btn", function() {
  window.location.href = `/admin/manage-order/${$(this).attr("data-order-id")}`;
});
