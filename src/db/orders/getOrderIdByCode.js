const { reader } = require("../pool");
const tables = require("../tables");

module.exports = async code => {
  let orderId = -1;
  try {
    orderId = await reader
      .select(`${tables.orders}.id as id`)
      .from(tables.orders)
      .where(`${tables.orders}.order_code`, code);
  } catch (e) {
    throw new Error("Error getting order ID.");
  }
  return orderId;
};
