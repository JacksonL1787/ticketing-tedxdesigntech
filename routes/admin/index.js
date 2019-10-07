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

router.get('/ticket-orders', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Ticket Orders', title: 'Ticket Orders', orders: JSON.stringify(await seats.getOrders(req))});
});

router.get('/create-ticket', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Create Ticket', title: 'Create Ticket', orders: JSON.stringify(await seats.getOrders(req))});
});

router.get('/revenue', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Revenue', title: 'Revenue', orders: JSON.stringify(await seats.getOrders(req))});
});

router.post('/setSeatPrices', async function(req, res, next) {
  updateDB.setSeatPrices(req,res)
});

module.exports = router;
