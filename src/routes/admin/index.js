var express = require('express');
var router = express.Router();

const auth = require('../auth')
const getAllOrders = require('../../db/orders/getAllOrders')
const getAllTakenSeats = require('../../db/seats/getAllTakenSeats')
const getOrderById = require('../../db/orders/getOrderById')
const updateOrderNote = require('../../db/orders/updateNote')
const updateOrderInfo = require('../../db/orders/updateOrderInfo')
const activateOrderShipping = require('../../db/shipments/activateOrderShipping')
const deactivateOrderShipping = require('../../db/shipments/deactivateOrderShipping')
const addTrackingNumber = require('../../db/shipments/addTrackingNumber')
const sendTicketsShippingEmail = require('../../mail/ticketsShipping')
const beginOrder = require('../../db/freeOrder/beginOrder')
const removeOldOrder = require('../../db/freeOrder/removeOldOrder')
const completeOrder = require('../../db/freeOrder/completeOrder')
const sendOrderCompleteEmail = require('../../mail/orderComplete')


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

router.post('/api/cancelOrder', async function(req, res, next) {
  removeOldOrder(req.body.orderId)
  res.sendStatus(200)
});

router.post('/api/beginOrder', async function(req, res, next) {
  if(req.body.orderId) {
    await removeOldOrder(req.body.orderId)
  }
  let orderId = await beginOrder(req.body.seats)
  res.send({orderId: orderId})
});

router.post('/api/completeOrder', async function(req, res, next) {
  let orderCode = await completeOrder(req.body)
  sendOrderCompleteEmail({email: req.body.email, first_name: req.body.firstName, order_code: orderCode})
  res.sendStatus(200)
});

router.post('/api/updateOrderNote', async function(req, res, next) {
  updateOrderNote(req.body)
  res.sendStatus(200)
});

router.post('/api/updateOrderInfo', async function(req, res, next) {
  updateOrderInfo(req.body)
  res.sendStatus(200)
});

router.post('/api/activateShipping', async function(req, res, next) {
  activateOrderShipping(req.body.orderId)
  res.sendStatus(200)
});

router.post('/api/deactivateShipping', async function(req, res, next) {
  deactivateOrderShipping(req.body.orderId)
  res.sendStatus(200)
});

router.post('/api/addTrackingNumber', async function(req, res, next) {
  addTrackingNumber(req.body)
  sendTicketsShippingEmail(req.body)
  res.sendStatus(200)
});

module.exports = router;
