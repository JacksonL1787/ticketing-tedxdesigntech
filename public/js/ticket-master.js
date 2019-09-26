let currentTotal = 0
let gaTicket = 0
let vipTicket = 0

const setTotal = () => {
  currentTotal = gaTicket*50 + vipTicket*70
  if(gaTicket+vipTicket == 0) {
    $('.next-step').addClass('disabled')
    $('p.total').text('No Tickets Selected')
  } else {
    $('.next-step').removeClass('disabled')
    $('p.total').html('Total: <span class="total-price">$'+currentTotal+' + Fees</span>')
  }
}

$('.ga-ticket-inpt').on('input', function() {
  let val = $(this).val() || 0
  gaTicket = parseInt(val)
})

$('.vip-ticket-inpt').on('input', function() {
  let val = $(this).val() || 0
  vipTicket = parseInt(val)
})

$('.ticket-count').on('input', function() {
  setTotal()
})

$('.next-step').click(function() {
  if(!$(this).hasClass('disabled')) {
    console.log('next')
  }
})
