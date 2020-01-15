const { writer, reader } = require("../pool");
const tables = require("../tables");

module.exports = async orderId => {
  const trx = await writer.transaction();
  console.log(orderId);

  try {
    await trx(tables.seatsReservations)
      .where("order_id", orderId)
      .del();
  } catch {
    await trx.rollback();
    throw new Error("Failed to delete seat reservations.");
  }

  try {
    await trx(tables.orders)
      .where("id", orderId)
      .del();
  } catch (e) {
    await trx.rollback();
    throw new Error("Failed to delete order: ", e);
  }

  await trx.commit();
  return;
};
