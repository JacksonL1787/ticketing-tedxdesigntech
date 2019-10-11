var express = require('express');
var router = express.Router();

const auth = require('../auth')
const updateDB = require('./updateDB')
const render = require('./render')
const getTakenSeats = require('../../db/seats/getTakenSeats')
const getSeatPrices = require('../../db/seatTypes/getSeatPrices')
const createOrder = require('../../db/orders/createOrder')
const createCustomer = require('../../db/customers/createCustomer')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/seats/selection');
});

router.get('/seats/selection', async function(req, res, next) {
  res.render('seat-selection', {seatPrices: JSON.stringify(await getSeatPrices()), takenSeats: JSON.stringify(await getTakenSeats())});
  res.cookie('session_string', sessionString)
  res.send(200)
});

router.get('/seats/information', async function(req, res, next) {
  if(req.session.order) {
    render.seatInformation(req,res)
  } else {
    res.redirect('/seats/selection')
  }
});

router.get('/customer/information', function(req, res, next) {
  res.render('customer-information')
  // if(req.session.order) {
  //   render.customerInformation(req,res)
  // } else {
  //   res.redirect('/seats/information')
  // }
});

router.get('/seats/checkout', function(req, res, next) {

  // if(req.session.order) {
  //   render.seatCheckout(req,res)
  // } else {
  //   res.redirect('/customer/information')
  // }
});

router.get('/order-complete/', function(req, res, next) {
  res.render('order-complete')
});

router.post('/createOrder', function(req,res,next) {
  createOrder(req,res)
})

router.post('/seatNames', function(req,res,next) {
  updateDB.addNames(req,res)
})

router.post('/addCustomerInformation', function(req,res,next) {
  createCustomer(req.body)
})

router.post('/finishOrder', function(req,res,next) {
  updateDB.finishOrder(req,res)
})

module.exports = router;
