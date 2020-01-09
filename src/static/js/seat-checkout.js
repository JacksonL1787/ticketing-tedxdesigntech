let price = {
  subTotal: 0,
  fee: 0,
  total: 0
}

const addCartItems = () => {
  window.seatData.forEach((item) => {
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
    $('.your-cart-info .seats-wrap').append(`<div class="seat-wrap" data-seat="${tempData.seat}"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${tempData.seat} - <span class="seat-status">${tempData.seatStatus}</span></p><p class="seat-name">${tempData.name}</p></div><p class="seat-price">$${tempData.price}</p></div>`)
  })
}

const setPrice = () => {
  $('.your-cart-info .subtotal-wrap .charge').text(`$${price.subTotal.toFixed(2)}`)
  $('.your-cart-info .fees-wrap .charge').text(`$${price.fee.toFixed(2)}`)
  $('.your-cart-info .total-price').text(`$${price.total.toFixed(2)}`)
}

$(document).ready(function() {
  addCartItems()
  setPrice()
})

$('.payment .purchase-btn').click(function() {
  $.post({
    url: '/api/finishOrder',
    success: function() {
      window.location.href="/order-complete"
    }
  })
})

$('.go-back-btn').click(() => {
  window.location.href="/seats/information"
})
