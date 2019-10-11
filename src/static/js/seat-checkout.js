let price = {
  subTotal: 0,
  fees: 0,
  total: 0
}
let vipRows = ['A','B','C']

const addCartItems = () => {
  window.seatData.seats.forEach((item) => {
    let tempData = {
      price: window.seatPrices.gaSeats,
      seat: item.seat,
      name: item.name,
      seatStatus: 'GA'
    }
    let vipIcon = ''
    if(vipRows.includes(tempData.seat[tempData.seat.length - 1])) {
      tempData.price = window.seatPrices.vipSeats
      tempData.seatStatus = 'VIP'
      vipIcon = '<div class="icon"></div>'
    }
    price.subTotal+= tempData.price
    price.fees+= window.seatPrices.fees
    price.total = price.subTotal + price.fees
    $('.your-cart-info .seats-wrap').append(`<div class="seat-wrap" data-seat="${tempData.seat}"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${tempData.seat} - <span class="seat-status">${tempData.seatStatus}</span></p><p class="seat-name">${tempData.name}</p></div><p class="seat-price">$${tempData.price}</p></div>`)
  })
}

const setPrice = () => {
  $('.your-cart-info .subtotal-wrap .charge').text(`$${price.subTotal}`)
  $('.your-cart-info .fees-wrap .charge').text(`$${price.fees.toFixed(2)}`)
  $('.your-cart-info .total-price').text(`$${price.total.toFixed(2)}`)
}

$(document).ready(function() {
  addCartItems()
  setPrice()
})

$('.payment .purchase-btn').click(function() {
  $.post({
    url: '/finishOrder',
    success: function() {
      window.location.href="/order-complete"
    }
  })
})

$('.go-back-btn').click(() => {
  window.location.href="/customer/information"
})
