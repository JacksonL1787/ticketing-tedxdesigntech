"use strict";var check=function(){var a=!0;$("input").each(function(){if(!$(this).hasClass("address-line-two-inpt"))if($(this).val().replace(/ /g,"")){if(0>=$(this).val().length)return void(a=!1);!$(".email-inpt").val()||$(".email-inpt").val().includes("@")&&$(".email-inpt").val().includes(".")||(a=!1)}else a=!1}),a?$(".next-step").removeClass("disabled"):$(".next-step").addClass("disabled")},setCustomerInformation=function(){window.customerData&&($(".first-name-inpt").val(window.customerData.firstName),$(".last-name-inpt").val(window.customerData.lastName),$(".email-inpt").val(window.customerData.email),$(".phone-number-inpt").val(window.customerData.phoneNumber),$(".address-line-one-inpt").val(window.customerData.address.addressLineOne),$(".address-line-two-inpt").val(window.customerData.address.addressLineTwo),$(".city-inpt").val(window.customerData.address.city),$(".state-inpt").val(window.customerData.address.state),$(".zip-code-inpt").val(window.customerData.address.zipCode),check())};$("input").on("input",check),$(".next-step").click(function(){if(!$(this).hasClass("disabled")){var a={firstName:$(".first-name-inpt").val(),lastName:$(".last-name-inpt").val(),email:$(".email-inpt").val(),phoneNumber:$(".phone-number-inpt").val(),address:{addressLineOne:$(".address-line-one-inpt").val(),addressLineTwo:$(".address-line-two-inpt").val(),city:$(".city-inpt").val(),state:$(".state-inpt").val(),zipCode:$(".zip-code-inpt").val()}};$.post({url:"/addCustomerInformation",data:a,success:function success(){window.location.href="/seats/checkout"}})}}),$(document).ready(function(){setCustomerInformation()}),$(".go-back-btn").click(function(){window.location.href="/seats/information"});