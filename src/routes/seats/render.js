const seats = require('../seats')

module.exports = {
  seatSelection: (req,res) => {
    async function render() {
      const db = req.app.get("db")
      let orderID = req.session.order.orderID
      var orderData = await db.collection('processingOrders').find({"orderID": orderID}).toArray()
      const data = {
        seats: orderData[0].seats
      }
      //res.render('seat-selection', {takenSeats: JSON.stringify(await getTakenSeats(req))})
    }
    render()
  },
  seatInformation: (req,res) => {
    async function render() {
      const db = req.app.get("db")
      let orderID = req.session.order.orderID
      var orderData = await db.collection('processingOrders').find({"orderID": orderID}).toArray()
      const data = {
        seats: orderData[0].seats
      }
      res.render('seat-information', {seatData: JSON.stringify(data)})
    }
    render()
  },
  customerInformation: (req,res) => {
    async function render() {
      const db = req.app.get("db")
      let orderID = req.session.order.orderID
      var orderData = await db.collection('processingOrders').find({"orderID": orderID}).toArray()
      if(orderData[0].status.stepTwo) {
        res.render('customer-information', {customerData: JSON.stringify(orderData[0].customerInformation)})
      } else {
        res.redirect('/seats/information')
      }

    }
    render()
  },
  seatCheckout: (req,res) => {
    async function render() {
      const db = req.app.get("db")
      let orderID = req.session.order.orderID
      var orderData = await db.collection('processingOrders').find({"orderID": orderID}).toArray()
      if(orderData[0].status.stepThree) {
        const data = {
          seats: orderData[0].seats
        }
        res.render('seat-checkout', {seatPrices: JSON.stringify(await seats.getPrices(req)), seatData: JSON.stringify(data)})
      } else {
        res.redirect('/customer/information')
      }

    }
    render()
  }
}
