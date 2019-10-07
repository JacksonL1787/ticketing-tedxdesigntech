const randomstring = require("randomstring")
const seats = require("../seats")

module.exports = {
  createOrder: function(req,res) {
    console.log(req.body)
    const db = req.app.get('db')
    let seats = [];
    req.body.seats.forEach((item) => {
      seats.push({seat: item})
    })
    let data = {
      orderID: randomstring.generate({length: 7}).toUpperCase(),
      time: Date.now(),
      seats: seats,
      status: {
        stepOne: true,
        stepTwo: false,
        stepThree: false,
        stepFour: false
      }
    }
    if(!Array.isArray(data.seats)) {
      data.seats = [data.seats]
    }
    if(req.session.order) {
      db.collection('processingOrders').deleteOne({"orderID": req.session.order.orderID})
    }
    db.collection('processingOrders').insertOne(data)
    req.session.order = {
      orderID: data.orderID
    }
    res.send(200)
  },
  addNames: function(req, res) {
    const db = req.app.get('db')
    const orderID = req.session.order.orderID
    db.collection('processingOrders').update({"orderID": orderID}, {$set: {seats: req.body.seats, "status.stepTwo": true}})
    res.send(200)
  },
  addCustomerInformation: function(req,res) {
    const db = req.app.get('db')
    const orderID = req.session.order.orderID
    let customerData = req.body
    db.collection('processingOrders').update({"orderID": orderID}, {$set: {customerInformation: customerData, "status.stepThree": true}})
    res.send(200)
  },
  finishOrder: async function(req,res) {
    const db = req.app.get('db')
    const orderID = req.session.order.orderID
    var orderData = await db.collection('processingOrders').find({"orderID": orderID}).toArray()
    orderData = orderData[0]
    delete orderData.status
    orderData.time = Date.now()

    // Seat Pricing
    let seatPrices = await seats.getPrices(req)
    orderData.prices = {
      gaSeatPrice: 0,
      vipSeatPrice: 0,
      fees: orderData.seats.length * seatPrices.fees,
      total: 0
    }
    orderData.seats.forEach(async function(item) {
      if(['A','B','C'].includes(item.seat[item.seat.length - 1])) {
        orderData.prices.vipSeatPrice += seatPrices.vipSeats
      } else {
        orderData.prices.gaSeatPrice += seatPrices.gaSeats
      }
    })
    orderData.prices.total = orderData.prices.gaSeatPrice + orderData.prices.vipSeatPrice + orderData.prices.fees


    console.log(orderData)
    delete req.session.order
    db.collection('processingOrders').deleteOne({"orderID": orderID})
    db.collection('orders').insertOne(orderData)
    res.send(200)
  }
}
