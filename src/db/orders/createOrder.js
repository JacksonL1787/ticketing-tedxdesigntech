const { writer, reader } = require("../pool");
const tables = require("../tables");
const randomstring = require("randomstring");
const getTakenSeats = require("../seats/getTakenSeats");

module.exports = async seats => {
  const sessionString = randomstring.generate({
    length: 64
  });
  //database transaction - allows you make consistent reads and writes
  const trx = await writer.transaction();

  let takenSeats = [];
  try {
    takenSeats = await getTakenSeats(seats, trx);
  } catch (e) {
    return e;
  }
  if (takenSeats.length > 0) {
    await trx.rollback();
    throw new Error(
      `One or more of the requested seats is taken: ${takenSeats.join(", ")}`
    );
  }

  let orderId = 0;
  try {
    orderId = await trx(tables.orders)
      .insert({
        order_code: randomstring.generate({ length: 7 }),
        status: 1
      })
      .returning("id")
      .then(d => d[0]);
  } catch {
    await trx.rollback();
    throw new Error("Failed to create order.");
  }

  try {
    await trx(tables.sessions).insert({
      session_string: sessionString,
      order_id: orderId
    });
    const st = await trx(tables.seatsReservations)
      .insert(
        seats.map(s => ({
          order_id: orderId,
          seat_id: trx
            .select("id")
            .from(tables.seats)
            .where("name", s)
        }))
      )
      .returning("*");
  } catch (e) {
    await trx.rollback();
    throw e;
  }

  await trx.commit();
  return { id: orderId, sessionString: sessionString };
};
