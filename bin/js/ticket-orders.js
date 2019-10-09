"use strict";var checkIfOrders=function(){$(".orders-wrap .hidden").length==$(".orders-wrap .order").length||0==$(".orders-wrap .order").length?$(".no-orders").show():$(".no-orders").hide()};$(function(){$(document).ready(function(){window.orders.forEach(function(a){var b="";a.seats.forEach(function(a){b+="<p class=\"pill\">".concat(a.seat,"</p>")}),$(".orders-wrap").prepend("<div class=\"order\"><div class=\"top\"><h1 class=\"order-id\">#".concat(a.orderID,"</h1><div class=\"action-btn\" data-order-id=\"").concat(a.orderID,"\"><div class=\"icon\"></div></div></div><div class=\"content\"><div class=\"info-wrap customer-name-wrap\"><label>Customer Name</label><p>").concat(a.customerInformation.firstName," ").concat(a.customerInformation.lastName,"</p></div><div class=\"info-wrap customer-email-wrap\"><label>Customer Email</label><p>").concat(a.customerInformation.email,"</p></div><div class=\"info-wrap date-wrap\"><label>Date</label><p data-time=\"").concat(a.time,"\">").concat(moment(a.time).format("MMM DD, YYYY"),"</p></div><div class=\"info-wrap price-wrap\"><label>Price</label><p>").concat("$0"=="$"+a.prices.total?"Free":"$"+a.prices.total,"</p></div><div class=\"info-wrap seats-wrap\"><label>Seats</label><div class=\"pill-wrap\">").concat(b,"</div></div></div></div>"))}),checkIfOrders()})}),$(".search-wrap .search-bar").on("input",function(){var a=$(this).val().toLowerCase();$(".orders-wrap .order").each(function(){var b=[];$(this).find(".pill").each(function(){b.push($(this).text())}),$(this).find(".order-id").text().slice(1,8).toLowerCase().startsWith(a)||$(this).find(".order-id").text().toLowerCase().startsWith(a)||$(this).find(".customer-name-wrap").children("p").text().toLowerCase().startsWith(a)||$(this).find(".order-id").text().toLowerCase().startsWith(a)||$(this).find(".customer-email-wrap").children("p").text().toLowerCase().startsWith(a)||b.includes(a.toUpperCase())?$(this).removeClass("hidden"):$(this).addClass("hidden")}),checkIfOrders()}),$(".filter-bar .filter-option").click(function(){$(".filter-bar .filter-option").removeClass("active"),$(this).addClass("active");var a;if($(this).hasClass("today-filter"))a=864e5;else if($(this).hasClass("week-filter"))a=6048e5;else if($(this).hasClass("month-filter"))a=2592e6;else return void $(".orders-wrap .order").show();$(".orders-wrap .order").each(function(){0<=parseInt($(this).find(".date-wrap").children("p").attr("data-time"))-(Date.now()-a)?$(this).show():$(this).hide()}),checkIfOrders()});