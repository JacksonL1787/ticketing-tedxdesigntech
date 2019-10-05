let price = {
  subTotal: 0,
  fees: 0,
  total: 0
}
let vipRows = ['A','B','C']

const addCartItems = () => {
  window.seatData.seats.forEach((item) => {
    let tempData = {
      price: 30,
      seat: item.seat,
      name: item.name,
      seatStatus: 'GA'
    }
    let vipIcon = ''
    if(vipRows.includes(tempData.seat[tempData.seat.length - 1])) {
      tempData.price = 50
      tempData.seatStatus = 'VIP'
      vipIcon = '<div class="icon"></div>'
    }
    price.subTotal+= tempData.price
    price.fees+= 5.75
    price.total = price.subTotal + price.fees
    $('.your-cart-info .seats-wrap').append(`<div class="seat-wrap" data-seat="${tempData.seat}"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${tempData.seat} - <span class="seat-status">${tempData.seatStatus}</span></p><p class="seat-name">${tempData.name}</p></div><p class="seat-price">$${tempData.price}</p></div>`)
  })
  console.log(price)
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

$('.go-back-btn').click(() => {
  window.location.href="/customer/information"
})
