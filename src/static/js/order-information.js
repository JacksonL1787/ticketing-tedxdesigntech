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

const addSeatInfo = () => {
  
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
})
