let checkIfOrders = () => {
  if($('.orders-wrap .hidden').length == $('.orders-wrap .order').length || $('.orders-wrap .order').length == 0) {
    $('.no-orders').show()
  } else {
    $('.no-orders').hide()
  }
}


$(function() {
  $(document).ready(function() {
    window.orders.forEach(function(item, index) {
      let seatsHTML = ''
      item.seats.forEach(function(item) {
        seatsHTML+=`<p class="pill">${item.seat}</p>`
      })
      $('.orders-wrap').prepend(`<div class="order"><div class="top"><h1 class="order-id">#${item.orderID}</h1><div class="action-btn" data-order-id="${item.orderID}"><div class="icon"></div></div></div><div class="content"><div class="info-wrap customer-name-wrap"><label>Customer Name</label><p>${item.customerInformation.firstName} ${item.customerInformation.lastName}</p></div><div class="info-wrap customer-email-wrap"><label>Customer Email</label><p>${item.customerInformation.email}</p></div><div class="info-wrap date-wrap"><label>Date</label><p data-time="${item.time}">${moment(item.time).format('MMM DD, YYYY')}</p></div><div class="info-wrap price-wrap"><label>Price</label><p>$${item.prices.total}</p></div><div class="info-wrap seats-wrap"><label>Seats</label><div class="pill-wrap">${seatsHTML}</div></div></div></div>`)
    })
    checkIfOrders()
  })
})

$('.search-wrap .search-bar').on('input', function() {
  let val = $(this).val().toLowerCase()
  $('.orders-wrap .order').each(function() {
    let seats = []
    $(this).find('.pill').each(function() {
      seats.push($(this).text())
    })
    if($(this).find('.order-id').text().slice(1,8).toLowerCase().startsWith(val) || $(this).find('.order-id').text().toLowerCase().startsWith(val) || $(this).find('.customer-name-wrap').children('p').text().toLowerCase().startsWith(val) || $(this).find('.order-id').text().toLowerCase().startsWith(val) || $(this).find('.customer-email-wrap').children('p').text().toLowerCase().startsWith(val) || seats.includes(val.toUpperCase())) {
      $(this).removeClass('hidden')
    } else {
      $(this).addClass('hidden')
    }
  })
  checkIfOrders()
})

$('.filter-bar .filter-option').click(function() {
  $('.filter-bar .filter-option').removeClass('active')
  $(this).addClass('active')
  let time;
  if($(this).hasClass('today-filter')) {
    time = 86400000;
  } else if($(this).hasClass('week-filter')) {
    time = 604800000;
  } else if($(this).hasClass('month-filter')) {
    time = 2592000000;
  } else {
    $('.orders-wrap .order').show();
    return;
  }
  $('.orders-wrap .order').each(function() {
    if((parseInt($(this).find('.date-wrap').children('p').attr('data-time')) - (Date.now() - time)) >= 0) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
  checkIfOrders()
})
