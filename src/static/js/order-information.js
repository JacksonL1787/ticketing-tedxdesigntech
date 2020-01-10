const hideShippingStatuses = () => {
  $('.shipping-status-widget .shipment-status').hide()
}

const showShipmentNotSent = () => {
  hideShippingStatuses()
  $('.shipping-status-widget .not-shipped').show()
}

const showShipmentCancelled = () => {
  hideShippingStatuses()
  $('.shipping-status-widget .shipping-cancelled-wrap').show()
}

const showShipmentSent = () => {
  hideShippingStatuses()
  $('.shipping-status-widget .tickets-shipping-wrap').show()
}

const addBasicInfo = () => {
  $('.basic-info-widget .order-code').text(`#${window.order.order_code}`)
  $('.basic-info-widget .time-of-purchase').text(moment(window.order.timestamp).format('MMM DD, YYYY LT'))
}

const addCustomerDetails = () => {
  $('.customer-details-widget .first-name').text(`${window.order.first_name || 'None'}`)
  $('.customer-details-widget .last-name').text(`${window.order.last_name || 'None'}`)
  $('.customer-details-widget .email').text(`${window.order.email || 'None'}`)
  $('.customer-details-widget .phone-number').text(`${window.order.phone_number || 'None'}`)
  $('.customer-details-widget .address-line-one').text(`${window.order.address_line_one || 'None'}`)
  $('.customer-details-widget .address-line-two').text(`${window.order.address_line_two || 'None'}`)
  $('.customer-details-widget .city').text(`${window.order.city || 'None'}`)
  $('.customer-details-widget .state').text(`${window.order.state || 'None'}`)
  $('.customer-details-widget .zip-code').text(`${window.order.zip_code || 'None'}`)
}

const updateShipmentStatus = () => {
  if(window.order.shipment_status) {
    showShipmentSent()
    return;
  }
  if(window.order.not_shipping) {

    showShipmentCancelled()
  } else {
    showShipmentNotSent()
  }
}

const addSeatInfo = () => {
  const price = {
    subTotal: 0,
    fee: 0,
    total: 0
  }
  window.order.seats.forEach((item) => {
    let vipIcon = item.type === "VIP" ? '<div class="icon"></div>' : ''
    price.subTotal+= parseFloat(item.price)
    price.fee+= parseFloat(item.fee)
    price.total = price.subTotal + price.fee
    $('.seat-info-widget .seats-wrap').append(`<div class="seat-wrap"><div class="seat">${vipIcon}</div><div class="seat-info"><p class="seat-number">Seat ${item.name} - <span class="seat-status">${item.type}</span></p><p class="seat-name">${item.attendee_name}</p></div><p class="seat-price">$${item.price}</p></div>`)
  })

  $('.seat-info-widget .subtotal-wrap .charge').text(price.subTotal === 0 ? "Free" : `$${price.subTotal.toFixed(2)}`)
  $('.seat-info-widget .fees-wrap .charge').text(price.fee === 0 ? "Free" : `$${price.fee.toFixed(2)}`)
  $('.seat-info-widget .total-price').text(parseFloat(window.order.payment_amount) == 0 ? "Free" : `$${parseFloat(window.order.payment_amount).toFixed(2)}`)

  if(window.order.payment_amount == 0) {
    $('.seat-info-widget .seats-wrap .seat-price').text('$0.00')
    $('.seat-info-widget .subtotal-wrap .charge').text('$0.00')
    $('.seat-info-widget .fees-wrap .charge').text('$0.00')
  }

}

const addShippingStatus = () => {

}

$(document).ready(() => {
  if(!window.order) {
    $('.not-valid-wrap').show()
    return;
  }
  $('.layout, .top').show()
  $('.top .page-title').text(`Order #${window.order.order_code}`)
  addBasicInfo()
  addCustomerDetails()
  addSeatInfo()
  addShippingStatus()
  updateShipmentStatus()
})

$('.shipping-status-widget .track-tickets-btn').click(() => {
  window.open(`https://www.ups.com/track?tracknum=${window.order.shipment_tracking_number}`, '_blank')
})
