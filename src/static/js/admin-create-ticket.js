let orderData = new Object


/*

  MODULE 1 FUNCTIONS

*/

$(function() {
  let rows = 12
  let seatsPerRow = 30
  let vipRows = ['A','B','C']
  let rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  let seatCount = 0

  const createSeats = () => {
    for(var i = 1; i <= rows;i++) {
      let column1 = []
      let column2 = []
      for(var a = 1; a <= seatsPerRow;a++) {
        let classes = 'seat available'
        if (vipRows.includes(rowNames[i - 1])) {
          classes = classes + ' vip-seat'
        }
        if(a > seatsPerRow/2) {
          column2.push(`<div class="${classes}" data-seat="${a}${rowNames[i - 1]}"><div class="icon"></div></div>`)
        } else {
          column1.push(`<div class="${classes}" data-seat="${a}${rowNames[i - 1]}"><div class="icon"></div></div>`)
        }
      }
      $('.module1 .seat-wrap').append(`<div class="row row${i}"><div class="column1 column">${column1.join("")}</div><p class="row-letter">${rowNames[i - 1]}</p><div class="column2 column">${column2.join("")}</div></div>`)
    }
  }

  const markTakenSeats = () => {
    if(window.takenSeats) {
      window.takenSeats.forEach(function(item) {
        $(`.module1 .seat-wrap .seat[data-seat="${item}"]`).addClass('taken').removeClass('available')
      })
    }
  }

  const checkButton = () => {
    if(seatCount > 0) {
      $('.module1 .next-step').removeClass('disabled')
    } else {
      $('.module1 .next-step').addClass('disabled')
    }
  }

  $(document).on('click', '.module1 .seat', function() {
    if(!$(this).hasClass('taken')) {
      if($(this).hasClass('selected')) {
        $(this).removeClass('selected')
        seatCount--
      } else {
        seatCount++
        $(this).addClass('selected')
      }
      checkButton()
    }
  })

  $(document).ready(function() {
    createSeats()
    markTakenSeats()
  })
})


/*

  MODULE 2 FUNCTIONS

*/

$(function() {
  let vipRows = ['A', 'B', 'C']

  const appendInputs = () => {
    let seats = orderData.seats
    seats.forEach((item) => {
      let inputVal = ''
      if(item.name) {
        inputVal = item.name
        $('.module2 .next-step').removeClass('disabled')
      }
      let appendWrap = '.ga-tickets'
      if(vipRows.includes(item.seat[item.seat.length - 1])) {
        appendWrap = '.vip-tickets'
      }
      $(`.module2 .form-content ${appendWrap} .inputs-wrap`).append(`<div class="seat-input-wrap" data-seat="${item.seat}"><div class="seat-number-wrap"><p class="seat-number">${item.seat}</p></div><input value="${inputVal}" class="seat-name-inpt" type="text" placeholder="First and Last Name" onkeypress="return (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 65 && event.charCode <= 90) || event.charCode == 32"/></div>`)
    })
    if($('.module2 .ga-tickets .inputs-wrap').children().length == 0) {
      $('.module2 .ga-tickets .no-tickets').show()
      $('.module2 .ga-tickets .inputs-wrap').hide()
    } else {
      $('.module2 .ga-tickets .no-tickets').hide()
      $('.module2 .ga-tickets .inputs-wrap').show()
    }

    if($('.module2 .vip-tickets .inputs-wrap').children().length == 0) {
      $('.module2 .vip-tickets .no-tickets').show()
      $('.module2 .vip-tickets .inputs-wrap').hide()
    } else {
      $('.module2 .vip-tickets .no-tickets').hide()
      $('.module2 .vip-tickets .inputs-wrap').show()
    }
  }

  $(document).on('input', '.module2 .seat-name-inpt',function() {
    let inputVal = $(this).val()
    let check = true
    $('.module2 .seat-name-inpt').each(function() {
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
      $('.module2 .next-step').removeClass('disabled')
    } else {
      $('.module2 .next-step').addClass('disabled')
    }
  })

  $('.module2 .go-back-btn').click(function() {
    $('.module1').removeClass('hidden')
    $('.module2').addClass('hidden')
    $('.module2 .inputs-wrap').empty()
  })

  $('.module1 .next-step').click(function() {
    if(!$(this).hasClass('disabled')) {
      $('.module1').addClass('hidden')
      orderData.seats = []
      $('.module1 .seat-wrap .selected').each(function() {
        orderData.seats.push({seat: $(this).attr('data-seat')})
      })
      $('.module2').removeClass('hidden')
      appendInputs()
    }
  })
})

$(function() {

  const check = () => {
    let checkStatus = true
    $('.module3 input').each(function() {
      if(!$(this).hasClass('address-line-two-inpt')) {
        if($(this).val().replace(/ /g, '')) {
          if($(this).val().length <= 0) {
            checkStatus = false;
            return;
          }
          if($('.module3 .email-inpt').val()) {
            if(!$('.module3 .email-inpt').val().includes("@") || !$('.module3 .email-inpt').val().includes(".")) {
              checkStatus = false
            }
          }
        } else {
          checkStatus = false
        }
      }
    })
    if(checkStatus) {
      $('.module3 .finish-order-btn').removeClass('disabled')
    } else {
      $('.module3 .finish-order-btn').addClass('disabled')
    }
  }

  $('.module3 input').on('input', check)

  $('.module3 .go-back-btn').click(function() {
    $('.module2').removeClass('hidden')
    $('.module3').addClass('hidden')
  })

  $('.module2 .next-step').click(function() {
    if(!$(this).hasClass('disabled')) {
      $('.module2').addClass('hidden')
      orderData.tempSeats = []
      $('.module2 .inputs-wrap .seat-name-inpt').each(function() {
        let seat = $(this).parent().attr('data-seat')
        let val = $(this).val()
        let tempObj = {seat: seat, name: val}
        orderData.tempSeats.push(tempObj)
      })
      orderData.seats = orderData.tempSeats
      delete orderData.tempSeats
      $('.module3').removeClass('hidden')
    }
  })
})


$(function() {
  let count = 1
  const setupSuccessfulOrderPage = () => {
    $('.order-complete-page .info').text(`This order has been processed successfully. Information regarding the order has been sent to ${orderData.customerInformation.firstName} ${orderData.customerInformation.lastName} via email.`)
    setInterval(function() {
      if(count == 15) {
        window.close()
      }
      count++
      $('.order-complete-page .notify-redirect span').text(parseInt($('.order-complete-page .notify-redirect span').text() - 1))
    }, 1000)
  }

  $('.module3 .finish-order-btn').click(function() {
    if(!$(this).hasClass('disabled')) {
      $('.module3').addClass('hidden')
      orderData.customerInformation = {
        firstName: $('.first-name-inpt').val(),
        lastName: $('.last-name-inpt').val(),
        email: $('.email-inpt').val(),
        phoneNumber: $('.phone-number-inpt').val(),
        address: {
          addressLineOne: $('.address-line-one-inpt').val(),
          addressLineTwo: $('.address-line-two-inpt').val(),
          city: $('.city-inpt').val(),
          state: $('.state-inpt').val(),
          zipCode: $('.zip-code-inpt').val()
        }
      }
      $.ajax({
        url: '/admin/createTicket',
        type: 'post',
        data: orderData
      })
      $('.order-complete-page').removeClass('hidden')
      setupSuccessfulOrderPage()
    }
  })
})
