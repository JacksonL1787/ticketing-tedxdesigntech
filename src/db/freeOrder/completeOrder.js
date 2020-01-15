const { writer, reader } = require("../pool");
const tables = require("../tables");
const getSeatIds = require("./getSeatIds");

module.exports = async data => {
  //database transaction - allows you make consistent reads and writes
  const trx = await writer.transaction();

  let orderCode = "";

  try {
    // Update Order Status in orders table
    orderCode = await trx(tables.orders)
      .where("id", data.orderId)
      .update({ status: 4 })
      .returning("order_code");
  } catch (e) {
    await trx.rollback();
    throw new Error("Failed to create order.");
  }

  try {
    await trx(tables.customers).insert({
      order_id: data.orderId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phoneNumber,
      address_line_1: data.addressLineOne,
      address_line_2: data.addressLineTwo,
      city: data.city,
      state: data.state,
      zip_code: data.zipCode
    });
  } catch (e) {
    await trx.rollback();
    throw new Error("Failed to add customer data.");
  }

  const seatQueries = [];

  data.seats.forEach(seat => {
    // Update Seat Data in seats table
    seatQueries.push(
      trx(tables.seats)
        .where("name", seat.name)
        .update({
          attendee_name: seat.attendeeName,
          order_id: data.orderId
        })
    );
  });
  await Promise.all(seatQueries).catch(trx.rollback);

  let tempSeatData = await getSeatIds(data.seats);
  console.log(tempSeatData);
  const seatsReservationsQueries = [];
  tempSeatData.forEach(seat => {
    let attendeeName = "";
    data.seats.forEach(s2 => {
      if (s2.name == seat.name) {
        attendeeName = s2.attendeeName;
      }
    });
    seatsReservationsQueries.push(
      trx(tables.seatsReservations)
        .where("seat_id", seat.id)
        .update({
          attendee_name: attendeeName
        })
    );
  });
  Promise.all(seatsReservationsQueries).catch(trx.rollback);

  try {
    await trx(tables.payments).insert({
      order_id: data.orderId,
      amount: 0
    });
  } catch (e) {
    await trx.rollback();
    throw new Error("Failed to add payment information.");
  }

  try {
    await trx(tables.shipments).insert({
      order_id: data.orderId,
      status: false
    });
  } catch (e) {
    await trx.rollback();
    throw new Error("Failed to add shipment information");
  }

  await trx.commit();
  return orderCode[0];
};
