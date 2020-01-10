const { writer, reader } = require('../pool')
const tables = require('../tables')

module.exports = async(data) => {
  //database transaction - allows you make consistent reads and writes
  const trx = await writer.transaction()
  console.log(data)
  console.log(data.seats)
  try { // Update Order Status in orders table
    orderId = await trx(tables.orders)
      .where('id', data.order_id)
      .update({status: 4})
  } catch(e) {
    await trx.rollback()
    throw new Error('Failed to create order.')
  }

  const queries = [];
  data.seats.forEach((seat) => { // Update Seat Data in seats table
    queries.push(trx(tables.seats)
      .where('id', seat.seat_id)
      .update({
        attendee_name: seat.attendee_name,
        order_id: data.order_id
    }));
  })
  Promise.all(queries)
    .catch(trx.rollback)

  try {
    let paymentAmount = 0
    data.seats.forEach((seat) => {
      paymentAmount += parseFloat(seat.price) + parseFloat(seat.fee)
    })
    await trx(tables.payments)
      .insert({
        order_id: data.order_id,
        amount: paymentAmount
      })
  } catch(e) {
    await trx.rollback()
    throw new Error ('Failed to add payment information.')
  }

  try {
    await trx(tables.shipments)
      .insert({
        order_id: data.order_id,
        status: false
      })
  } catch(e) {
    await trx.rollback()
    throw new Error ('Failed to add shipment information')
  }

  try { // Delete Session Row in sessions table
    await trx(tables.sessions)
      .where('order_id', data.order_id)
      .del()
  } catch(e) {
    await trx.rollback()
    throw new Error ('Faied to remove session string.')
  }

  await trx.commit()
  return;
}
