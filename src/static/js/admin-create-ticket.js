let orderData = new Object();

/*

  MODULE 1 FUNCTIONS

*/

$(function() {
  let seatsPerRow = 30;
  let vipRows = ["A", "B", "C"];
  let rowNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  let seatCount = 0;

  const createSeats = () => {
    for (var i = 1; i <= rowNames.length; i++) {
      let column1 = [],
        column2 = [];
      for (var a = 1; a <= seatsPerRow; a++) {
        let classes = vipRows.includes(rowNames[i - 1])
          ? "seat available vip-seat"
          : "seat available";
        if (a > seatsPerRow / 2) {
          column2.push(
            `<div class="${classes}" data-seat="${
              rowNames[i - 1]
            }${a}"><div class="icon"></div></div>`
          );
        } else {
          column1.push(
            `<div class="${classes}" data-seat="${
              rowNames[i - 1]
            }${a}"><div class="icon"></div></div>`
          );
        }
      }
      $(".module1 .seat-wrap").append(
        `<div class="row row${i}"><div class="column1 column">${column1.join(
          ""
        )}</div><p class="row-letter">${
          rowNames[i - 1]
        }</p><div class="column2 column">${column2.join("")}</div></div>`
      );
    }
  };

  const markTakenSeats = () => {
    if (window.takenSeats) {
      window.takenSeats.forEach(function(item) {
        console.log(item.name);
        $(`.module1 .seat-wrap .seat[data-seat="${item.name}"]`)
          .addClass("taken")
          .removeClass("available");
      });
    }
  };

  const selectCurrentSeats = () => {
    if (window.userSeats) {
      window.userSeats.forEach(function(item) {
        let newDiv = document.createElement("div");
        newDiv.setAttribute("data-seat", item.name);
        if (item.type === "VIP") {
          newDiv.setAttribute("class", "vip-seat");
        }
        $(`.seat-wrap .seat[data-seat="${item.name}"]`).addClass("selected");
        selectSeat($(newDiv));
      });
    }
  };

  const checkButton = () => {
    if (seatCount > 0) {
      $(".module1 .next-step").removeClass("disabled");
    } else {
      $(".module1 .next-step").addClass("disabled");
    }
  };

  $(".module1 .cancel-btn").click(function() {
    if (orderData.orderId) {
      $.post({
        url: "/admin/api/cancelOrder",
        data: {
          orderId: orderData.orderId
        },
        success: () => {
          window.close();
        }
      });
    } else {
      window.close();
    }
  });

  $(document).on("click", ".module1 .seat-wrap .seat", function() {
    if (!$(this).hasClass("taken")) {
      if ($(this).hasClass("selected")) {
        $(this).removeClass("selected");
        seatCount--;
      } else {
        seatCount++;
        $(this).addClass("selected");
      }
      checkButton();
    }
  });

  $(document).ready(function() {
    createSeats();
    markTakenSeats();
  });
});

/*

  MODULE 2 FUNCTIONS

*/

$(function() {
  const check = () => {
    let checkStatus = true;
    $(".module2 input").each(function() {
      if (!$(this).hasClass("address-line-two-inpt")) {
        if (
          $(this)
            .val()
            .replace(/ /g, "")
        ) {
          if ($(this).val().length <= 0) {
            checkStatus = false;
            return;
          }
          if ($(".module2 .email-inpt").val()) {
            if (
              !$(".module2 .email-inpt")
                .val()
                .includes("@") ||
              !$(".module2 .email-inpt")
                .val()
                .includes(".")
            ) {
              checkStatus = false;
            }
          }
        } else {
          checkStatus = false;
        }
      }
    });
    if (checkStatus) {
      $(".module2 .next-step").removeClass("disabled");
    } else {
      $(".module2 .next-step").addClass("disabled");
    }
  };
  $(".module2 input").on("input", check);

  $(".module2 .go-back-btn").click(function() {
    $(".module1").removeClass("hidden");
    $(".module2").addClass("hidden");
  });

  $(".module1 .next-step").click(function() {
    if (!$(this).hasClass("disabled")) {
      $(".module1").addClass("hidden");
      $(".module2").removeClass("hidden");
      let data = {
        seats: [],
        orderId: orderData.orderId
      };
      $(".module1 .seat-wrap .seat.selected").each(function() {
        data.seats.push($(this).data("seat"));
      });
      $.post({
        url: "/admin/api/beginOrder",
        data: data,
        success: result => {
          orderData.orderId = result.orderId;
        }
      });
    }
  });
});

/*

  MODULE 3 FUNCTIONS

*/

$(function() {
  let vipRows = ["A", "B", "C"];

  const appendInputs = () => {
    let seats = orderData.seats;
    seats.forEach(item => {
      let inputVal = "";
      if (item.name) {
        inputVal = item.name;
        $(".module3 .next-step").removeClass("disabled");
      }
      let appendWrap = ".ga-tickets";
      if (vipRows.includes(item.seat[0])) {
        appendWrap = ".vip-tickets";
      }
      $(`.module3 .form-content ${appendWrap} .inputs-wrap`).append(
        `<div class="seat-input-wrap" data-seat="${item.seat}"><div class="seat-number-wrap"><p class="seat-number">${item.seat}</p></div><input value="${inputVal}" class="seat-name-inpt" type="text" placeholder="First and Last Name" onkeypress="return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode===32"/></div>`
      );
    });
    if ($(".module3 .ga-tickets .inputs-wrap").children().length === 0) {
      $(".module3 .ga-tickets .no-tickets").show();
      $(".module3 .ga-tickets .inputs-wrap").hide();
    } else {
      $(".module3 .ga-tickets .no-tickets").hide();
      $(".module3 .ga-tickets .inputs-wrap").show();
    }

    if ($(".module3 .vip-tickets .inputs-wrap").children().length === 0) {
      $(".module3 .vip-tickets .no-tickets").show();
      $(".module3 .vip-tickets .inputs-wrap").hide();
    } else {
      $(".module3 .vip-tickets .no-tickets").hide();
      $(".module3 .vip-tickets .inputs-wrap").show();
    }
  };

  $(document).on("input", ".module3 .seat-name-inpt", function() {
    let inputVal = $(this).val();
    let check = true;
    $(".module3 .seat-name-inpt").each(function() {
      let valArr = $(this)
        .val()
        .split(" ");
      if (valArr.length >= 2) {
        if (valArr[0].length <= 0 || valArr[1].length <= 0) {
          check = false;
          return;
        }
      } else {
        check = false;
        return;
      }
    });

    if (check) {
      $(".module3 .finish-order-btn").removeClass("disabled");
    } else {
      $(".module3 .finish-order-btn").addClass("disabled");
    }
  });

  $(".module3 .go-back-btn").click(function() {
    $(".module2").removeClass("hidden");
    $(".module3").addClass("hidden");
    $(".module3 .inputs-wrap").empty();
  });

  $(".module2 .next-step").click(function() {
    if (!$(this).hasClass("disabled")) {
      $(".module2").addClass("hidden");
      orderData.seats = [];
      $(".module1 .seat-wrap .selected").each(function() {
        orderData.seats.push({ seat: $(this).attr("data-seat") });
      });
      $(".module3").removeClass("hidden");
      appendInputs();
    }
  });
});

$(function() {
  let count = 1;
  const setupSuccessfulOrderPage = () => {
    $(".order-complete-page .info").text(
      `This order has been processed successfully. Information regarding the order has been sent to ${$(
        ".first-name-inpt"
      ).val()} ${$(".last-name-inpt").val()} via email.`
    );
    $(".top-tag-wrap .tag-text").text("Now you may close/reload the page.");
    setInterval(function() {
      if (count === 15) {
        window.close();
      }
      count++;
      $(".order-complete-page .notify-redirect span").text(
        parseInt($(".order-complete-page .notify-redirect span").text() - 1)
      );
    }, 1000);
  };

  $(".module3 .finish-order-btn").click(function() {
    if (!$(this).hasClass("disabled")) {
      let data = {
        firstName: $(".first-name-inpt").val(),
        lastName: $(".last-name-inpt").val(),
        email: $(".email-inpt").val(),
        phoneNumber: $(".phone-number-inpt").val(),
        addressLineOne: $(".address-line-one-inpt").val(),
        addressLineTwo: $(".address-line-two-inpt").val(),
        city: $(".city-inpt").val(),
        state: $(".state-inpt").val(),
        zipCode: $(".zip-code-inpt").val(),
        orderId: orderData.orderId,
        seats: []
      };
      $(".module1 .seat-wrap .seat.selected").each(function() {
        data.seats.push({
          name: $(this).data("seat"),
          attendeeName: $(
            `.module3 .seat-input-wrap[data-seat="${$(this).data(
              "seat"
            )}"] input`
          ).val()
        });
      });
      console.log(data);
      $.post({
        url: "/admin/api/completeOrder",
        data: data,
        success: () => {
          $(".module3").addClass("hidden");
          $(".order-complete-page").removeClass("hidden");
          setupSuccessfulOrderPage();
        }
      });
    }
  });
});
