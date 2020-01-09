var express = require('express');
var router = express.Router();

const auth = require('../auth')
const getAllOrders = require('../../db/orders/getAllOrders')
const getAllTakenSeats = require('../../db/seats/getAllTakenSeats')
const getOrderById = require('../../db/orders/getOrderById')
const updateOrderNote = require('../../db/orders/updateNote')
const updateOrderInfo = require('../../db/orders/updateOrderInfo')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/admin/dashboard');
});

router.get('/dashboard', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Dashboard', title: 'Dashboard', orders: JSON.stringify(await getAllOrders())});
});

router.get('/orders', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Orders', title: 'Orders', orders: JSON.stringify(await getAllOrders())});
});

router.get('/create-ticket', async function(req, res, next) {
  res.render('admin-create-ticket', {takenSeats: JSON.stringify(await getAllTakenSeats())})
});

router.get('/manage-order/:orderID', async function(req, res, next) {
  res.render('admin-dashboard', {page: 'Manage Order', title: 'Manage Order', order: JSON.stringify(await getOrderById(req.params.orderID))})
});

// router.get('/revenue', async function(req, res, next) {
//   res.render('admin-dashboard', {page: 'Revenue', title: 'Revenue', orders: JSON.stringify(await getAllOrders())});
// });

// router.post('/api/createTicket', async function(req, res, next) {
//   //updateDB.createAdminTicket(req,res)
//   res.sendStatus(200)
// });

router.post('/api/updateOrderNote', async function(req, res, next) {
  updateOrderNote(req.body)
  res.sendStatus(200)
});

router.post('/api/updateOrderInfo', async function(req, res, next) {
  updateOrderInfo(req.body)
  res.sendStatus(200)
});

module.exports = router;
