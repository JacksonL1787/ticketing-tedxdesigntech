"use strict";$(document).ready(function(){"/admin/dashboard"==window.location.pathname?$(".dashboard-nav-item").addClass("active"):"/admin/create-ticket"==window.location.pathname?$(".create-ticket-nav-item").addClass("active"):"/admin/ticket-orders"==window.location.pathname?$(".ticket-orders-nav-item").addClass("active"):"/admin/revenue"==window.location.pathname&&$(".revenue-nav-item").addClass("active")}),$(".dashboard-nav-item").click(function(){return window.location.href="/admin/dashboard"}),$(".ticket-orders-nav-item").click(function(){return window.location.href="/admin/ticket-orders"}),$(".revenue-nav-item").click(function(){return window.location.href="/admin/revenue"}),$(".create-ticket-nav-item").click(function(){window.open("/admin/create-ticket","_blank")});