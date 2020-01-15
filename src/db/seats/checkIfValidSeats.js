const tables = require("../tables");

module.exports = async (orderId, ids, db) => {
  // const takenSeats = await reader.select('name').from(tables.seats).whereNotNull('attendee_name').then(data=>data.map(x=>x.name))
  // return takenSeats
  if (!ids) {
    return ids;
  }
  const idsRaw = ids.reduce(
    (a, c, i, s) => (a += s.length === i + 1 ? `'${c}'` : `'${c}', `),
    ""
  );
  const validSeats = await db.raw(
    ` SELECT *
FROM seats_reservations
WHERE
	order_id = ${orderId}
	AND seat_id IN (${idsRaw})
`
  );
  console.log(validSeats.rows);
  return validSeats.rows.length === ids.length ? true : false;
};
