var express = require('express');
var router = express.Router();

const auth = require('../auth')
const updateDB = require('./updateDB')
const render = require('./render')
const seats = require('../seats')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/seats/selection');
});

router.get('/seats/selection', async function(req, res, next) {
  if(req.session.order) {
    render.seatSelection(req,res)
  } else {
    res.render('seat-selection', {seatPrices: JSON.stringify(await seats.getPrices(req)), takenSeats: JSON.stringify(await seats.takenSeats(req))});
  }
});

router.get('/seats/information', async function(req, res, next) {
  if(req.session.order) {
    render.seatInformation(req,res)
  } else {
    res.redirect('/seats/selection')
  }
});

router.get('/customer/information', function(req, res, next) {
  if(req.session.order) {
    render.customerInformation(req,res)
  } else {
    res.redirect('/seats/information')
  }
});

router.get('/seats/checkout', function(req, res, next) {
  if(req.session.order) {
    render.seatCheckout(req,res)
  } else {
    res.redirect('/customer/information')
  }
});

router.get('/order-complete/', function(req, res, next) {
  res.render('order-complete')
});

router.post('/createOrder', function(req,res,next) {
  updateDB.createOrder(req,res)
})

router.post('/seatNames', function(req,res,next) {
  updateDB.addNames(req,res)
})

router.post('/addCustomerInformation', function(req,res,next) {
  updateDB.addCustomerInformation(req,res)
})

router.post('/finishOrder', function(req,res,next) {
  updateDB.finishOrder(req,res)
})

module.exports = router;
