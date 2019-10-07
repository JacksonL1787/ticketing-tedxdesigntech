let overview = {
  seats: [],
  price: 0
}

let rows = 12
let seatsPerRow = 30
let vipRows = ['A','B','C']
let rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']



const createSeats = () => {
  for(var i = 1; i <= rows;i++) {
    console.log(i)
    let column1 = []
    let column2 = []
    for(var a = 1; a <= seatsPerRow;a++) {
      let classes = 'seat available'
      if (vipRows.includes(rowNames[i - 1])) {
        classes = classes + ' vip-seat'
      }
      if(a > seatsPerRow/2) {
        column2.push(`<div class="${classes}" data-seat="${a}${rowNames[i - 1]}"><div class="icon"></div></div>`)
      } else {
        column1.push(`<div class="${classes}" data-seat="${a}${rowNames[i - 1]}"><div class="icon"></div></div>`)
      }
    }
    $('.seat-wrap').append(`<div class="row row${i}"><div class="column1 column">${column1.join("")}</div><p class="row-letter">${rowNames[i - 1]}</p><div class="column2 column">${column2.join("")}</div></div>`)
  }
}

const markTakenSeats = () => {
  if(window.takenSeats) {
    window.takenSeats.forEach(function(item) {
      $(`.seat-wrap .seat[data-seat="${item}"]`).addClass('taken').removeClass('available')
    })
  }
}

const setPrice = (change) => {
  overview.price += change
  if(overview.price <= 0) {
    $('.purchase-wrap .next-step').addClass('disabled')
    $('.purchase-wrap p.total').text('No Tickets Selected')
  } else {
    $('.purchase-wrap .next-step').removeClass('disabled')
    $('.purchase-wrap p.total').html(`Total: <span class="total-price">$${overview.price}+ Fees</span>`)
  }
}

const addSeatInfo = (seat, price) => {
  $('.overview-wrap .seats-wrap').append(`<div class="seat-number-wrap"><p class="seat-price">$${price}</p><p class="seat-number">${seat}</p></div>`)
}

const removeSeatInfo = (seat) => {
  let seatNum = seat
  $('.overview-wrap .seats-wrap .seat-number-wrap').each(function() {
    if($(this).children('.seat-number').text() == seatNum) {
      $(this).remove()
      return;
    }
  })
}

const selectSeat = (seat) => {
  overview.seats.push(seat.attr('data-seat'))
  let number;
  $('.seats-wrap .none-selected').hide()
  if(seat.hasClass('vip-seat')) {
    number = parseInt($('.vip-tickets-wrap .number-of-tickets .number').text()) + 1
    $('.vip-tickets-wrap .number-of-tickets .number').text(number)
    setPrice(window.seatPrices.vipSeats)
    addSeatInfo(seat.attr('data-seat'), window.seatPrices.vipSeats)
  } else {
    number = parseInt($('.ga-tickets-wrap .number-of-tickets .number').text()) + 1
    $('.ga-tickets-wrap .number-of-tickets .number').text(number)
    setPrice(window.seatPrices.gaSeats)
    addSeatInfo(seat.attr('data-seat'), window.seatPrices.gaSeats)
  }

}

const removeSeat = (seat) => {
  overview.seats.splice(overview.seats.indexOf(seat.attr('data-seat')), 1)
  if(overview.seats.length == 0) {
    $('.seats-wrap .none-selected').show()
  }
  let number;
  removeSeatInfo(seat.attr('data-seat'))
  if(seat.hasClass('vip-seat')) {
    number = parseInt($('.vip-tickets-wrap .number-of-tickets .number').text()) - 1
    $('.vip-tickets-wrap .number-of-tickets .number').text(number)
    setPrice(-window.seatPrices.vipSeats)
  } else {
    number = parseInt($('.ga-tickets-wrap .number-of-tickets .number').text()) - 1
    $('.ga-tickets-wrap .number-of-tickets .number').text(number)
    setPrice(-window.seatPrices.gaSeats)
  }
}

const selectCurrentSeats = () => {
  if(window.seatData) {
    window.seatData.seats.forEach(function(item) {
      let newDiv = document.createElement('div')
      newDiv.setAttribute('data-seat', item.seat)
      if(vipRows.includes(item.seat[item.seat.length - 1])) {
        newDiv.setAttribute('class', 'vip-seat')
      }
      $(`.seat-wrap .seat[data-seat="${item.seat}"]`).addClass('selected')
      selectSeat($(newDiv))
    })
  }
}

$(document).on('click', '.seat', function() {
  if(!$(this).hasClass('taken')) {
    if($(this).hasClass('selected')) {
      $(this).removeClass('selected')
      removeSeat($(this))
    } else {
      $(this).addClass('selected')
      selectSeat($(this))
    }
  }
})

$(document).ready(function() {
  createSeats()
  selectCurrentSeats()
  markTakenSeats()
})

$('.next-step').click(function() {
  if(!$(this).hasClass('disabled')) {
    let data = {
      seats: overview.seats
    }
    $.post({
      url: "/createOrder",
      data: data,
      success: function() {
        window.location.href="/seats/information"
      }
    })
  }
})
