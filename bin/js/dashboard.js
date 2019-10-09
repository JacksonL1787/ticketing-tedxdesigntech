"use strict";var vipRows=["A","B","C"],gaSeatTotal=270,vipSeatTotal=90,getSeatTotals=function(){var a=0,b=0;return window.orders.forEach(function(c){c.seats.forEach(function(c){vipRows.includes(c.seat.slice(-1))?a++:b++})}),{vipSeatsSold:a,gaSeatsSold:b}};$(function(){// Set Seats Sold Data Widgets
var a=function(a){var b=100*(a/vipSeatTotal);$(".vip-seats-sold-widget .seats-sold").text(a),$(".vip-seats-sold-widget .seats-left").text(vipSeatTotal-a),$(".vip-seats-sold-widget .g2").css("stroke-dashoffset",628.318530718-628.318530718*(b/100)),$(".vip-seats-sold-widget .marker").css("transform","rotate(".concat(360*(b/100),"deg)"))},b=function(a){var b=100*(a/gaSeatTotal);$(".ga-seats-sold-widget .seats-sold").text(a),$(".ga-seats-sold-widget .seats-left").text(gaSeatTotal-a),$(".ga-seats-sold-widget .g2").css("stroke-dashoffset",628.318530718-628.318530718*(b/100)),$(".ga-seats-sold-widget .marker").css("transform","rotate(".concat(360*(b/100),"deg)"))};$(document).ready(function(){a(getSeatTotals().vipSeatsSold),b(getSeatTotals().gaSeatsSold)})}),$(function(){// Set Info Widgets
var a=function(){var a=0;return window.orders.forEach(function(b){0<b.time-(Date.now()-6048e5)&&(a+=b.prices.total)}),a.toFixed(2)},b=function(){var a=0;return window.orders.forEach(function(b){a+=b.prices.gaSeatPrice}),a.toFixed(2)},c=function(){var a=0;return window.orders.forEach(function(b){a+=b.prices.vipSeatPrice}),a.toFixed(2)};$(document).ready(function(){$(".info-widgets .ga-revenue-widget .info").text("$".concat(b())),$(".info-widgets .vip-revenue-widget .info").text("$".concat(c())),$(".info-widgets .number-of-orders-widget .info").text(window.orders.length),$(".info-widgets .this-weeks-earnings-widget .info").text("$".concat(a()))})}),$(function(){// Set Prices Widget
$(document).ready(function(){$(".seat-prices-widget .ga-seat-price .price-inpt").val(window.seatPrices.gaSeats.toFixed(2)),$(".seat-prices-widget .vip-seat-price .price-inpt").val(window.seatPrices.vipSeats.toFixed(2)),$(".seat-prices-widget .fees-price .price-inpt").val(window.seatPrices.fees.toFixed(2))})}),$(".seat-prices-widget .price-inpt").on("input",function(a){console.log(a)}),$(".seat-prices-widget .add-btn").click(function(){var a=$(this).siblings(".price-inpt");a.val((parseFloat(a.val())+1).toFixed(2))}),$(".seat-prices-widget .minus-btn").click(function(){var a=$(this).siblings(".price-inpt");0<=parseFloat(a.val())-1&&a.val((parseFloat(a.val())-1).toFixed(2))}),$(".seat-prices-widget .update-prices").click(function(){var a={gaSeats:parseFloat($(".seat-prices-widget .ga-seat-price .price-inpt").val()),vipSeats:parseFloat($(".seat-prices-widget .vip-seat-price .price-inpt").val()),fees:parseFloat($(".seat-prices-widget .fees-price .price-inpt").val())};$.ajax({url:"/admin/setSeatPrices",type:"post",data:a,success:function success(){window.location.reload()}})}),$(function(){$(document).ready(function(){window.orders.forEach(function(a,b){if(5<=b)return!1;var c=window.orders[window.orders.length-1-b],d="";c.seats.forEach(function(a){d+="<p class=\"pill\">".concat(a.seat,"</p>")}),$(".recent-orders table tbody").append("<tr><td><p class=\"customer-info\">".concat(c.customerInformation.firstName," ").concat(c.customerInformation.lastName,"</p></td><td><p class=\"date-info\">").concat(moment(c.time).format("MMM DD, YYYY"),"</p></td><td><p class=\"price-info\">$").concat(c.prices.total.toFixed(2),"</p></td><td><div class=\"pill-flex-wrap\">").concat(d,"</td><td><div class=\"action-btn\" data-order=\"").concat(c.orderID,"\"><div class=\"icon\"></div></div></td></tr>"))})})});