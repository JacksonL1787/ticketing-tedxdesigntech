const tables = require('../tables')

module.exports = async (seats, db) => {
  // const takenSeats = await reader.select('name').from(tables.seats).whereNotNull('attendee_name').then(data=>data.map(x=>x.name))
  // return takenSeats
  if(!seats) {
    return seats
  }

  const takenSeats = await db.select(
      db.ref(`${tables.seats}.name`)
      .as('seat_name'))
    .from(tables.seats)
    .innerJoin(tables.seatsReservations,
      `${tables.seats}.id`,
      `${tables.seatsReservations}.seat_id`)
    .whereIn(`${tables.seats}.name`, seats)
    .whereNotNull(`${tables.seats}.order_id`)
    .orWhereNotNull(`${tables.seatsReservations}.id`)
    .where(`${tables.seatsReservations}.timestamp`, '>=', 'now()', '-', 'interval', '15 minutes')
  return takenSeats.map(ts => ts.seat_name)
}

(async() => {
  console.log(await module.exports(['A1', 'A2', 'A3'], require('../pool').reader))
})()
