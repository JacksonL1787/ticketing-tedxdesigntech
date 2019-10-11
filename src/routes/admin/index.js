var express = require('express');
var router = express.Router();

const auth = require('../auth')
const updateDB = require('./updateDB')
const render = require('./render')
const seats = require('../seats')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/admin/dashboard');
});

router.get('/dashboard', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Dashboard', title: 'Dashboard', orders: JSON.stringify(await seats.getOrders(req)), prices: JSON.stringify(await seats.getPrices(req))});
});

router.get('/orders', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Orders', title: 'Orders', orders: JSON.stringify(await seats.getOrders(req))});
});

router.get('/create-ticket', async function(req, res, next) {
  res.render('admin-create-ticket', {takenSeats: JSON.stringify(await seats.takenSeats(req))})
});

router.get('/manage-order/:orderID', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Manage Order', title: 'Manage Order', order: JSON.stringify(await seats.getOrders(req, req.params.orderID))})
});

router.get('/revenue', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Revenue', title: 'Revenue', orders: JSON.stringify(await seats.getOrders(req))});
});

router.post('/setSeatPrices', async function(req, res, next) {
  updateDB.setSeatPrices(req,res)
});

router.post('/createTicket', async function(req, res, next) {
  updateDB.createAdminTicket(req,res)
});

module.exports = router;
