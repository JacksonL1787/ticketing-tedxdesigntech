const { writer } = require('../pool')
const tables = require('../tables')

module.exports = async (orderId) => {
  try {
    console.log('order_id', orderId)
    await writer.raw(`update "seats_reservations" set "timestamp" = NOW() - INTERVAL '15 minutes' where "order_id" = ${orderId}`)
  } catch(e) {
    console.log(e)
  }
  return;
}
