const vipRows = ['A', 'B', 'C']

$(function() { // ADD DATA TO DOCUMENT

  const addCustomerInfo = () => {
    $('.customer-info-widget .first-name-inpt').val(order.first_name)
    $('.customer-info-widget .last-name-inpt').val(order.last_name)
    $('.customer-info-widget .email-inpt').val(order.email)
    $('.customer-info-widget .phone-number-inpt').val(order.phone_number)
    $('.customer-info-widget .address-1-inpt').val(order.address_line_one)
    $('.customer-info-widget .address-2-inpt').val(order.address_line_two)
    $('.customer-info-widget .city-inpt').val(order.city)
    $('.customer-info-widget .state-inpt').val(order.state)
    $('.customer-info-widget .zip-code-inpt').val(order.zip_code)
  }

  const addSeatInfo = () => {
    order.seats.forEach((seat) => {
      let appendWrap = seat.type === "VIP" ? '.vip-seats' : '.ga-seats'
      $(`.seat-info-widget ${appendWrap} .inputs-wrap`).append(`<div class="seat-input-wrap" data-seat-id="${seat.seat_id}" data-seat="${seat.name}"><div class="seat-number-wrap"><p class="seat-number">${seat.name}</p></div><input value="${seat.attendee_name}" class="seat-name-inpt" type="text" placeholder="First and Last Name" onkeypress="return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32"/></div>`)
    })
    if($('.seat-info-widget .ga-seats .inputs-wrap').children().length == 0) {
      $('.seat-info-widget .ga-seats .no-seats').show()
      $('.seat-info-widget .ga-seats .inputs-wrap').hide()
    }
    if($('.seat-info-widget .vip-seats .inputs-wrap').children().length == 0) {
      $('.seat-info-widget .vip-seats .no-seats').show()
      $('.seat-info-widget .vip-seats .inputs-wrap').hide()
    }
  }

  const addCartInfo = () => {
    const price = {
      subTotal: 0,
      fee: 0,
      total: 0
    }
    order.seats.forEach((item) => {
      let tempData = {
        price: item.price,
        seat: item.name,
        name: item.attendee_name,
        seatStatus: item.type,
        fee: item.fee
      }
      let vipIcon = item.type === "VIP" ? '<div class="icon"></div>' : ''
      price.subTotal+= parseFloat(tempData.price)
      price.fee+= parseFloat(item.fee)
      price.total = price.subTotal + price.fee
      $('.cart-info-widget .seats-wrap').append(`<div class="seat-wrap" data-seat="${tempData.seat}"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${tempData.seat} - <span class="seat-status">${tempData.seatStatus}</span></p><p class="seat-name">${tempData.name}</p></div><p class="seat-price">$${tempData.price}</p></div>`)
    })
    $('.cart-info-widget .subtotal-wrap .charge').text(price.subTotal === 0 ? "Free" : `$${price.subTotal.toFixed(2)}`)
    $('.cart-info-widget .fees-wrap .charge').text(price.fee === 0 ? "Free" : `$${price.fee.toFixed(2)}`)
    $('.cart-info-widget .total-price').text(price.total === 0 ? "Free" : `$${price.total.toFixed(2)}`)
  }

  const addBasicInfo = () => {
    $('.basic-info-widget .order-id-wrap h1').text(order.order_code)
    $('.basic-info-widget .purchase-time-wrap h1').text(moment(order.timestamp).format('MMM DD, YYYY LT'))
  }

  const addPaymentInfo = () => {

  }

  const addNotesInfo = () => {
    if(window.order.order_note) {
      console.log('addNote')
      $('.notes-info-widget .note').val(window.order.order_note)
    }
  }

  $(document).ready(() => {
    addCustomerInfo()
    addSeatInfo()
    addCartInfo()
    addBasicInfo()
    addPaymentInfo()
    addNotesInfo()
  })
})

const checkForUpdate = () => {
  let check = false
  if($('.customer-info-widget .first-name-inpt').val() != order.first_name
    || $('.customer-info-widget .last-name-inpt').val() != order.last_name
    || $('.customer-info-widget .email-inpt').val() != order.email
    || $('.customer-info-widget .phone-number-inpt').val() != order.phone_number
    || $('.customer-info-widget .address-1-inpt').val() != order.address_line_one
    || $('.customer-info-widget .address-2-inpt').val() != order.address_line_two
    || $('.customer-info-widget .city-inpt').val() != order.city
    || $('.customer-info-widget .state-inpt').val() != order.state
    || $('.customer-info-widget .zip-code-inpt').val() != order.zip_code) {
      check = true
  }
  order.seats.forEach((seat) => {
    if(seat.attendee_name != $(`.seat-info-widget .seat-input-wrap[data-seat="${seat.name}"] input`).val()) {
      check = true
      return;
    }
  })
  if(check) {
    $('.update-info-widget .send-email-wrap .checkbox').removeClass('checked')
    $('.update-info-widget .update-info-btn').removeClass('disabled')
    $('.update-info-widget .send-email-wrap').removeClass('hidden')
  } else {
    $('.update-info-widget .send-email-wrap').addClass('hidden')
    $('.update-info-widget .update-info-btn').addClass('disabled')
  }
}

$('.update-info-widget .send-email-wrap .checkbox').click(function() {
  $(this).toggleClass('checked')
})

$('.notes-info-widget .note').on('input', function() {
  if($(this).val() != order.note) {
    $('.notes-info-widget .update-note-btn').removeClass('disabled')
  } else {
    $('.notes-info-widget .update-note-btn').addClass('disabled')
  }
})

$(() => {
  let check;

  const noteUpdating = () => {
    $('.notes-info-widget .note-status-loader').addClass('show')
    $('.notes-info-widget .note-status-updated').removeClass('show')
  }
  const noteUpdated = () => {
    $('.notes-info-widget .note-status-loader').removeClass('show')
    $('.notes-info-widget .note-status-updated').addClass('show')
  }

  $('.notes-info-widget .note').on('input', () => {
    noteUpdating()
    clearTimeout(check)
    check = setTimeout(() => {
      noteUpdated()
      $.ajax({
        type: "POST",
        url: "/admin/api/updateOrderNote",
        data: {
          orderId: window.order.order_id,
          note: $('.notes-info-widget .note').val()
        }
      })
    }, 650)
  })
})

$(document).on('input', '.customer-info-widget input, .seat-info-widget input', function() {
  checkForUpdate()
})

$('.update-info-widget .update-info-btn').click(function() {
  if(!$(this).hasClass('disabled')) {
    const data = {
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
      sendEmail: $('.update-info-widget .checkbox').hasClass('checked') ? true: false
    }
    $('.seat-info-widget .seat-input-wrap').each(function() {
      data.seats.push({
        name: $(this).data('seat'),
        attendee_name: $(this).children('input').val(),
        id: $(this).data('seat-id')
      })
    })
    $.ajax({
      type: 'post',
      url: '/admin/api/updateOrderInfo',
      data: data,
      success: () => {
        console.log('success')
      }
    })
  }
})
