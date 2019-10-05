let emailCheck = false

const check = () => {
  let checkStatus = true
  $('input').each(function() {
    if(!$(this).hasClass('address-line-two-inpt')) {
      if($(this).val().replace(/ /g, '')) {
        if($(this).val().length <= 0) {
          checkStatus = false;
          return;
        }
        if($('.email-inpt').val()) {
          if(!$('.email-inpt').val().includes("@") || !$('.email-inpt').val().includes(".")) {
            checkStatus = false
          }
        }
      } else {
        checkStatus = false
      }
    }
  })
  if(checkStatus) {
    $('.next-step').removeClass('disabled')
  } else {
    $('.next-step').addClass('disabled')
  }
}

$('input').on('input', function() {
  let val = $(this).val()
  if(/["<>&'`]/g.test(val[val.length - 1])) {
    $(this).val(val.slice(0, val.length - 1))
  } else {
    check()
  }
})



$('.go-back-btn').click(() => {
  window.location.href="/seats/information"
})
