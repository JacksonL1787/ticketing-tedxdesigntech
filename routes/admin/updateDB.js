
module.exports = {
  setSeatPrices: (req,res) => {
    const db = req.app.get("db")
    db.collection('prices').update({}, {$set: {gaSeats: parseFloat(req.body.gaSeats), vipSeats: parseFloat(req.body.vipSeats), fees: parseFloat(req.body.fees)}})
    res.send(200)
  }
}
