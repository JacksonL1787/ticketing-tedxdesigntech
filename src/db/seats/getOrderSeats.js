const { reader } = require("../pool");
const tables = require("../tables");

module.exports = async orderID => {
  let seats;
  console.log(orderID);
  try {
    seats = reader
      .select(
        `${tables.seatsReservations}.attendee_name`,
        `${tables.seats}.name`,
        `${tables.seatTypes}.name as type`,
        `${tables.seats}.id as seat_id`,
        `${tables.seatTypes}.price`,
        `${tables.seatTypes}.fee`
      )
      .from(tables.seatsReservations)
      .leftJoin(
        tables.seats,
        `${tables.seats}.id`,
        "=",
        `${tables.seatsReservations}.seat_id`
      )
      .leftJoin(
        tables.seatTypes,
        `${tables.seatTypes}.id`,
        "=",
        `${tables.seats}.type`
      )
      .where(`${tables.seatsReservations}.order_id`, orderID);
  } catch (e) {
    console.log("Error Fetching User Seats", e);
    throw new Error("Error Fetching User Seats");
  }
  return seats;
};
