const { writer, reader } = require('../pool')
const tables = require('../tables')
const randomstring = require('randomstring')
const getTakenSeats = require('../seats/getTakenSeats')

module.exports = async(seats) => {
  const sessionString = randomstring.generate({
    length: 64
  })
  //database transaction - allows you make consistent reads and writes
  const trx = await writer.transaction()

  let takenSeats = [];
  console.log('seats', seats);
  try {
    takenSeats = await getTakenSeats(seats, trx)
  } catch(e) {
    console.log('error from createorder', e)
    return e;
  }
  console.log(takenSeats)
  if(takenSeats.length > 0) {
    console.log('rollback')
    await trx.rollback()
    throw new Error(`One or more of the requested seats is taken: ${takenSeats.join(', ')}`);
  }

  let orderId = 0
  try {
    orderId = await trx(tables.orders)
      .insert({
        order_code: randomstring.generate({length: 7}),
        status: 1})
      .returning('id').then(d => d[0])
  } catch {
    await trx.rollback()
    throw new Error('Failed to create order.')
  }

  try {
    await trx(tables.sessions)
      .insert({
        session_string: sessionString,
        order_id: orderId});
    const st = await trx(tables.seatsReservations)
      .insert(seats.map(s => ({
        order_id: orderId,
        seat_id: trx.select('id')
          .from(tables.seats)
          .where('name', s)
        })))
      .returning('*')
    console.log('st', st);
  } catch(e) {
    console.log(e, 'rollback2')
    await trx.rollback()
    throw e
  }

  await trx.commit()
  return {id: orderId, sessionString: sessionString}

  // // orderId in scope
  // let seatIds = []
  // try {
  //   const results = await Promise.all([
  //     trx(tables.sessions)
  //       .insert({
  //         session_string: sessionString,
  //         order_id: orderID}),
  //     // inserting seat_reservations for all seats WHERE all seats exist
  //     // If any seats have a order != NULL then that seat
  //     // INSERT INTO seat_reservations (seat_id, order_id) SELECT (9, 10)
  //     // WHERE NOT EXISTS order NOT NULL
  //
  //     console.log(await trx.select('id').from(tables.seats)
  //       .whereIn('name', seats))
  //   ]);
  // } catch {
  //   trx.rollback()
  //   return new Error('Failed to ')
  // }
}
