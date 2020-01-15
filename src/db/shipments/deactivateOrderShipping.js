const { writer } = require("../pool");
const tables = require("../tables");

module.exports = async id => {
  try {
    await writer(tables.shipments)
      .update({ not_shipping: true })
      .where("order_id", id);
  } catch (e) {
    throw new Error("Error deactivating shipment");
  }
  return;
};
