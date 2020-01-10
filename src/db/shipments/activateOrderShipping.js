const { writer } = require('../pool')
const tables = require('../tables')

module.exports = async (id) => {
  try{
    await writer(tables.shipments)
      .update({not_shipping: false})
      .where('order_id', id)
  } catch(e) {
    throw new Error('Error activating shipment')
  }
  return;
}
