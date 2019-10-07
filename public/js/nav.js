$(document).ready(function() {
  if(window.location.pathname == "/admin/dashboard") {
    $('.dashboard-nav-item').addClass('active')
  } else if(window.location.pathname == "/admin/create-ticket") {
    $('.create-ticket-nav-item').addClass('active')
  } else if(window.location.pathname == "/admin/ticket-orders") {
    $('.ticket-orders-nav-item').addClass('active')
  } else if((window.location.pathname == "/admin/revenue")) {
    $('.revenue-nav-item').addClass('active')
  }
})

$('.dashboard-nav-item').click(() => window.location.href="/admin/dashboard")
$('.ticket-orders-nav-item').click(() => window.location.href="/admin/ticket-orders")
$('.create-ticket-nav-item').click(() => window.location.href="/admin/create-ticket")
$('.revenue-nav-item').click(() => window.location.href="/admin/revenue")
