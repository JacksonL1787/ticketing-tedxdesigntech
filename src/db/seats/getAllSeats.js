const reader = require('../pool').reader
const tables = require('../tables')

module.exports = async () => {

  const allSeats = await reader.raw(`
    SELECT
	   ${tables.seats}.NAME AS name,
     CASE WHEN ${tables.seats}.order_id IS NULL
		   OR seats_reservations.id IS NULL
		   AND seats_reservations.TIMESTAMP < NOW() - INTERVAL '15 minutes'
		   THEN
		     TRUE
	     ELSE
		     FALSE
	     END AS is_available
	  FROM
		  ${tables.seats}
	    LEFT JOIN ${tables.seatsReservations} ON seats.id = seats_reservations.seat_id`)
  return allSeats.rows
}

(async() => {
  console.log(await module.exports())
})()
