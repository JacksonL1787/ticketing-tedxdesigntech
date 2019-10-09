let vipRows = ['A', 'B', 'C']

const appendInputs = () => {
  let seats = window.seatData.seats
  seats.forEach((item) => {
    let inputVal = ''
    if(item.name) {
      inputVal = item.name
      $('.next-step').removeClass('disabled')
    }
    let appendWrap = '.ga-tickets'
    if(vipRows.includes(item.seat[item.seat.length - 1])) {
      appendWrap = '.vip-tickets'
    }
    $(`.form-content ${appendWrap} .inputs-wrap`).append(`<div class="seat-input-wrap" data-seat="${item.seat}"><div class="seat-number-wrap"><p class="seat-number">${item.seat}</p></div><input value="${inputVal}" class="seat-name-inpt" type="text" placeholder="First and Last Name" onkeypress="return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32"/></div>`)
  })
  if($('.ga-tickets .inputs-wrap').children().length == 0) {
    $('.ga-tickets .no-tickets').show()
    $('.ga-tickets .inputs-wrap').hide()
  }
  if($('.vip-tickets .inputs-wrap').children().length == 0) {
    $('.vip-tickets .no-tickets').show()
    $('.vip-tickets .inputs-wrap').hide()
  }
}

$('.go-back-btn').click(() => {
  window.location.href="/seats/selection"
})

$(document).on('input', '.seat-name-inpt',function() {
  let inputVal = $(this).val()
  let check = true
  $('.seat-name-inpt').each(function() {
    let valArr = $(this).val().split(" ")
    if(valArr.length >= 2) {
      if(valArr[0].length <= 0 || valArr[1].length <= 0) {
        check = false
        return;
      }
    } else {
      check = false
      return;
    }
  })
  if(check) {
    $('.next-step').removeClass('disabled')
  } else {
    $('.next-step').addClass('disabled')
  }
})

$('.next-step').click(function() {
  if(!$(this).hasClass('disabled')) {
    let data = {
      seats: []
    }
    $('.seat-name-inpt').each(function() {
      let seat = $(this).parent().attr('data-seat')
      let val = $(this).val()
      let tempObj = {seat: seat, name: val}
      data.seats.push(tempObj)
    })
    $.post({
      url: "/seatNames",
      data: data,
      success: function() {
        window.location.href="/customer/information"
      }
    })
  }
})

$(document).ready(() => {
  appendInputs()
})
