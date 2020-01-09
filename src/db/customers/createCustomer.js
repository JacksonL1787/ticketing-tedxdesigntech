const { writer, reader } = require('../pool')
const tables = require('../tables')

module.exports = async (data) => {

  const trx = await writer.transaction()

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
  } catch(e) {
    console.log('rollback')
    await trx.rollback()
    console.log("Error adding customer data: ", e);
    throw new Error('Error adding customer data');
  }

  try {
    await trx(tables.orders)
      .where('id', data.orderId)
      .update({
        status: 2
      })
  } catch(e) {
    console.log('rollback')
    await trx.rollback()
    console.log("Error updating order status ", e)
    throw new Error('Error updating order status')
  }

  await trx.commit()
  return;
}
