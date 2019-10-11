const randomstring = require("randomstring")

module.exports = {
  setSeatPrices: (req,res) => {
    const db = req.app.get("db")
    db.collection('prices').update({}, {$set: {gaSeats: parseFloat(req.body.gaSeats), vipSeats: parseFloat(req.body.vipSeats), fees: parseFloat(req.body.fees)}})
    res.send(200)
  },
  createAdminTicket: (req,res) => {
    const db = req.app.get("db")
    const orderData = {
      orderID: randomstring.generate({length: 7}).toUpperCase(),
      time: Date.now(),
      seats: req.body.seats,
      customerInformation: req.body.customerInformation,
      prices: {
        gaSeatPrice: 0,
        vipSeatPrice: 0,
        fees: 0,
        total: 0
      },
      notes: [
        "This order was created by an administrator."
      ]
    }
    db.collection('orders').insertOne(orderData)
    res.send(200)
  }
}
