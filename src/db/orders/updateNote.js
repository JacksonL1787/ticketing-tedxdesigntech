const { writer, reader } = require('../pool')
const tables = require('../tables')

module.exports = async(data) => {
  try {
    await writer(tables.orders)
    .where('id', parseFloat(data.orderId))
    .update({note: data.note})
  } catch(e) {
    console.log("Error adding customer data: ", e);
    throw new Error(`Issue adding note`);
  }
  return;
}
