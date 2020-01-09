const appendInputs = () => {
  let seats = window.seatData
  seats.forEach((item) => {
    console.log(item)
    let inputVal = ''
    if(item.attendee_name) {
      inputVal = item.attendee_name
      $('.next-step').removeClass('disabled')
    }
    let appendWrap = item.type == "VIP" ? '.vip-tickets' : '.ga-tickets'
    $(`.form-content ${appendWrap} .inputs-wrap`).append(`<div class="seat-input-wrap" data-seat-id="${item.seat_id}" data-seat="${item.name}"><div class="seat-number-wrap"><p class="seat-number">${item.name}</p></div><input value="${inputVal}" class="seat-name-inpt" type="text" placeholder="First and Last Name" onkeypress="return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32"/></div>`)
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
  window.location.href="/customer/information"
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
      let seatId = $(this).parent().attr('data-seat-id')
      let tempObj = {attendee_name: val, id: seatId}
      data.seats.push(tempObj)
    })
    console.log(data)
    $.post({
      url: "/api/addAttendeeNames",
      data: data,
      success: function() {
        window.location.href="/seats/checkout"
      }
    })
  }
})

$(document).ready(() => {
  appendInputs()
})
