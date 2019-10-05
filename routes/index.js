var express = require('express');
var router = express.Router();

const auth = require('./auth')
const updateDB = require('./updateDB')
const render = require('./render')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/seats/selection');
});

router.get('/seats/selection', function(req, res, next) {
  if(req.session.order) {
    render.seatSelection(req,res)
  } else {
    res.render('seat-selection');
  }
});

router.get('/seats/information', function(req, res, next) {
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

router.post('/createOrder', function(req,res,next) {
  updateDB.createOrder(req,res)
})

router.post('/seatNames', function(req,res,next) {
  updateDB.addNames(req,res)
})

module.exports = router;
