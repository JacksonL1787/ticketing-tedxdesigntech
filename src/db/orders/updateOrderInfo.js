const { writer, reader } = require('../pool')
const tables = require('../tables')

module.exports = async (data) => {
  const trx = await writer.transaction()

  const queries = [];
  console.log(data)
  console.log(data.seats)
  data.seats.forEach((seat) => {
    queries.push(trx(tables.seats)
      .where('order_id', data.orderId)
      .where('name', seat.name)
      .update({
        attendee_name: seat.attendee_name
    }));
    queries.push(trx(tables.seatsReservations)
      .where('order_id', data.orderId)
      .where('seat_id', seat.id)
      .update({
        attendee_name: seat.attendee_name
    }));
  })
  Promise.all(queries)
    .catch((e) => {
      console.log("Error updating seat data: ", e);
      throw new Error('Error updating seat data');
      trx.rollback()
    })

  try {
    await writer(tables.customers)
      .where('order_id', data.orderId)
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        address_line_1: data.address_line_one,
        address_line_2: data.address_line_two,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code
    });
  } catch(e) {
    console.log("Error updating customer data: ", e);
    throw new Error('Error updating customer data');
    trx.rollback()
  }



  await trx.commit()
  return;
}
