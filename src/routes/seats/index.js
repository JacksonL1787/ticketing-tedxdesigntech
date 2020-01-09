var express = require('express');
var router = express.Router();

const auth = require('../auth')
const getTakenSeats = require('../../db/seats/getTakenSeats')
const getSeatPrices = require('../../db/seatTypes/getSeatPrices')
const createOrder = require('../../db/orders/createOrder')
const getAllTakenSeats = require('../../db/seats/getAllTakenSeats')
const createCustomer = require('../../db/customers/createCustomer')
const updateCustomerInfo = require('../../db/customers/updateCustomerInfo')
const getOrderSeats = require('../../db/seats/getOrderSeats')
const addAttendeeNames = require('../../db/seats/addAttendeeNames')
const resetUserOrder = require('../../db/orders/resetUserOrder')
const finishOrder = require('../../db/orders/finishOrder')
const sendOrderCompleteEmail = require('../../mail/orderComplete')
const getOrderIdByCode = require('../../db/orders/getOrderIdByCode')
const getOrderById = require('../../db/orders/getOrderById')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/seats/selection');
});

router.get('/seats/selection', async (req, res, next) => {
  res.locals.requiresAuth = false
  await auth(req,res,next)
  let userSeats;
  if(res.locals.user) {
    userSeats = await getOrderSeats(res.locals.user.order_id)
  }


  res.render('seat-selection', {userSeats: JSON.stringify(userSeats), seatPrices: JSON.stringify(await getSeatPrices()), takenSeats: JSON.stringify(await getAllTakenSeats())});
});



router.get('/customer/information', auth, async (req, res, next) => {
  if(res.locals.user.order_status < 1) {
    res.redirect('/seats/selection')
  }

  let customerData;
  if(res.locals.user.customer_id) {
    customerData = {
      firstName: res.locals.user.first_name,
      lastName: res.locals.user.last_name,
      email: res.locals.user.email,
      phoneNumber: res.locals.user.phone_number,
      addressLineOne: res.locals.user.address_line_one,
      addressLineTwo: res.locals.user.address_line_two,
      state: res.locals.user.state,
      city: res.locals.user.city,
      zipCode: res.locals.user.zip_code
    }
  }
  res.render('customer-information', {customerData: JSON.stringify(customerData)})
});

router.get('/seats/information', auth, async (req, res, next) => {
  if(res.locals.user.order_status < 2) {
    res.redirect('/seats/selection')
  }

  const seatData = await getOrderSeats(res.locals.user.order_id)
  res.render('seat-information', {seatData: JSON.stringify(seatData)})
});

router.get('/seats/checkout', auth, async (req, res, next) => {
  if(res.locals.user.order_status < 3) {
    res.redirect('/seats/information')
  }
  const seatData = await getOrderSeats(res.locals.user.order_id);
  res.render('seat-checkout', {seatData: JSON.stringify(seatData)});
});

router.get('/order-complete/', async (req, res, next) => {
  res.render('order-complete')
});

router.get('/order/:orderCode', async (req,res,next) => {
  const orderId = await getOrderIdByCode(req.params.orderCode)
  if(orderId.length == 0) {
    res.render('order-information')
    return;
  }
  const order = await getOrderById(orderId[0].id)
  delete order.order_id
  delete order.order_note
  delete order.order_status
  order.seats.forEach((s) => {
    delete s.seat_id
  })
  res.render('order-information', {order: JSON.stringify(order)})
})

router.post('/api/createOrder', async (req, res, next) => {
  res.locals.requiresAuth = false
  await auth(req,res,next)
  try {
    if(res.locals.user) {
      await resetUserOrder(res.locals.user.order_id)
    }
    const order = await createOrder(req.body.seats);
    res.cookie('session_string', order.sessionString)
    res.status(200).send(order.id.toString())
  } catch(e) {
    res.status(500).send(e.toString())
  }

})

router.post('/api/addAttendeeNames', auth, async (req, res, next) => {

  if(res.locals.user.order_status < 2) {
    return res.sendStatus(400)
  }

  let data = {
    orderId: res.locals.user.order_id,
    ...req.body
  }
  try {
    await addAttendeeNames(data)
    res.sendStatus(200)
  } catch(e) {
    res.sendStatus(500)
  }
})

router.post('/api/addCustomerInformation', auth, async (req, res, next) => {

  if(res.locals.user.order_status < 1) {
    return res.sendStatus(400)
  }

  const data = {
    orderId: res.locals.user.order_id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    addressLineOne: req.body.address.addressLineOne,
    addressLineTwo: req.body.address.addressLineTwo,
    city: req.body.address.city,
    state: req.body.address.state,
    zipCode: req.body.address.zipCode
  }

  try {
    if(res.locals.user.customer_id) {
      await updateCustomerInfo(data)
    } else {
      await createCustomer(data)
    }
    res.sendStatus(200)
  } catch(e) {
    res.status(400).send(e.toString())
  }
})

router.post('/api/finishOrder', auth, async (req, res, next) => {
  if(res.locals.user.order_status < 3) {
    return res.sendStatus(400)
  }

  const data = {
    seats: await getOrderSeats(res.locals.user.order_id),
    ...res.locals.user
  }

  try {
    await finishOrder(data)
    sendOrderCompleteEmail(data)
    res.cookie('session_string', undefined)
    res.sendStatus(200)
  } catch(e) {
    res.status(500)
  }
})

module.exports = router;
