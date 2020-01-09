const tables = require('../tables')

module.exports = async (seats, db) => {
  // const takenSeats = await reader.select('name').from(tables.seats).whereNotNull('attendee_name').then(data=>data.map(x=>x.name))
  // return takenSeats
  if(!seats) {
    return seats
  }
  const seatsRaw = seats.reduce((a, c, i, s) => a += s.length === i+1 ? `'${c}'` : `'${c}', `, '')
  const takenSeats = await db.raw(
    `SELECT "seats"."name" AS "seat_name"
FROM
	"seats"
	INNER JOIN "seats_reservations" ON "seats"."id" = "seats_reservations"."seat_id" AND "seats"."name" IN (${seatsRaw})
WHERE
	"seats"."order_id" IS NOT NULL
	OR "seats_reservations"."id" IS NOT NULL
	AND seats_reservations.timestamp >= now() - interval '15 minutes'
`)

  console.log(takenSeats.rows)
  return takenSeats.rows.map(ts => ts.seat_name)
}
