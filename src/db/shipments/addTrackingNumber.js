const { writer } = require('../pool')
const tables = require('../tables')

module.exports = async (data) => {
  try{
    await writer(tables.shipments)
      .update({tracking_number: data.trackingNumber, status: true})
      .where('order_id', data.orderId)
  } catch(e) {
    throw new Error('Error adding tracking number')
  }
  return;
}
