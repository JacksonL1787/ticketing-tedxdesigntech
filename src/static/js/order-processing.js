setInterval(() => {
  $.get({
    url: '/api/getPaymentStatus',
    success: () => {
      window.location.href="/order-complete"
    }
  })
}, 1000)
