const tables = require("../tables");
const { writer } = require("../pool");

module.exports = async () => {
  const takenSeats = await writer.raw(
    `SELECT "seats"."name" AS "name"
FROM
	"seats"
	INNER JOIN "seats_reservations" ON "seats"."id" = "seats_reservations"."seat_id"
WHERE
	"seats"."order_id" IS NOT NULL
	OR "seats_reservations"."id" IS NOT NULL
	AND seats_reservations.timestamp >= now() - interval '15 minutes'
`
  );

  return takenSeats.rows;
};
