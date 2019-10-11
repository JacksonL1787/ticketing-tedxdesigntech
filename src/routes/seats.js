module.exports = {
  takenSeats: async function(req) {
    async function getSeats() {
      const db = req.app.get("db");
      var orders = await db.collection('orders').find({}).toArray();
      let takenSeats = [];
      orders.forEach(function(item) {
        item.seats.forEach(function(item) {
          takenSeats.push(item.seat)
        })
      })
      return takenSeats
    }
    return await getSeats()
  },
  getOrders: async function(req, orderID) {
    async function getOrders() {
      const db = req.app.get("db");
      if(orderID) {
        var order = await db.collection('orders').find({orderID: orderID}).toArray();
        return order[0]
      } else {
        var orders = await db.collection('orders').find({}).toArray();
        return orders
      }


    }
    return await getOrders()
  },
  getPrices: async function(req) {
    async function getPrices() {
      const db = req.app.get("db");
      var prices = await db.collection('prices').find({}).toArray();
      return prices[0]
    }
    return await getPrices()
  }
}
