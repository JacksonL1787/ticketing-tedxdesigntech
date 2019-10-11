const { writer, reader } = require('../pool')
const tables = require('../tables')
const randomstring = require('randomstring')

module.exports = async(seats) => {
  const sessionString = randomstring.generate({
    length: 64
  })

  //database transaction - allows you make a consistent read and writes
  writer.transaction(async trx => {
    let orderId = 0
    try {
      orderId = await trx(tables.orders)
        .insert({
          order_code: randomstring.generate({length: 7}),
          status: 0})
        .returning('id')
    } catch {
      trx.rollback()
      return new Error('Failed to create order.')
    }

    // orderId in scope
    let seatIds = []
    try {
      const results = await Promise.all([
        trx(tables.sessions)
          .insert({
            session_string: sessionString,
            order_id: orderID}),
        // inserting seat_reservations for all seats WHERE all seats exist
        // If any seats have a order != NULL then that seat
        // INSERT INTO seat_reservations (seat_id, order_id) SELECT (9, 10)
        // WHERE NOT EXISTS order NOT NULL

        trx.select('id').from(tables.seats)
          .whereIn('name', seats)
      ]);
      seatIds = results[1]
    } catch {
      trx.rollback()
      return new Error('Failed to ')
    }



  })
}
