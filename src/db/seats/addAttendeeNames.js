const { writer, reader } = require('../pool')
const tables = require('../tables')
const checkIfValidSeats = require('./checkIfValidSeats')


module.exports = async (data) => {

  const trx = await writer.transaction()

  const seatIds = data.seats.map(obj => obj.id)

  let validSeats = true
  try {
    validSeats = await checkIfValidSeats(data.orderId, seatIds, trx)
  } catch(e) {
    console.log('error from createorder', e)
    return e;
  }
  if(!validSeats) {
    console.log('rollback')
    await trx.rollback()
    throw new Error(`One or more seats are invalid.`);
  }

  const queries = [];
  data.seats.forEach((seat) => {
    queries.push(trx(tables.seatsReservations)
      .where('order_id', data.orderId)
      .where('seat_id', parseInt(seat.id))
      .update({
        attendee_name: seat.attendee_name
    }));
  })
  Promise.all(queries)
    .catch(trx.rollback)

  try {
    await trx(tables.orders)
      .where('id', data.orderId)
      .update({
        status: 3
      })
  } catch(e) {
    await trx.rollback()
    throw new Error('Error updating order status')
  }

  await trx.commit()
  return;
}
