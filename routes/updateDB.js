const randomstring = require("randomstring")

module.exports = {
  createOrder: function(req,res) {
    console.log(req.body)
    const db = req.app.get('db')
    let seats = [];
    req.body.seats.forEach((item) => {
      seats.push({seat: item})
    })
    let data = {
      orderID: randomstring.generate(),
      time: Date.now(),
      seats: seats,
      status: {
        stepOne: true,
        stepTwo: false,
        stageThree: false,
        stepThree: false
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

  }
}
