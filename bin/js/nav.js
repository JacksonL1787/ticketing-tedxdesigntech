"use strict";

$(document).ready(function () {
  if (window.location.pathname == "/admin/dashboard") {
    $('.dashboard-nav-item').addClass('active');
  } else if (window.location.pathname == "/admin/create-ticket") {
    $('.create-ticket-nav-item').addClass('active');
  } else if (window.location.pathname == "/admin/orders") {
    $('.ticket-orders-nav-item').addClass('active');
  } else if (window.location.pathname == "/admin/revenue") {
    $('.revenue-nav-item').addClass('active');
  }
});
$('.dashboard-nav-item').click(function () {
  return window.location.href = "/admin/dashboard";
});
$('.ticket-orders-nav-item').click(function () {
  return window.location.href = "/admin/orders";
});
$('.revenue-nav-item').click(function () {
  return window.location.href = "/admin/revenue";
});
$('.create-ticket-nav-item').click(function () {
  window.open('/admin/create-ticket', '_blank');
});
//# sourceMappingURL=nav.js.map
