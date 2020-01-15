const { reader } = require("../pool");
const tables = require("../tables");
const getOrderSeats = require("../seats/getOrderSeats");

module.exports = async id => {
  let orderRaw;
  try {
    orderRaw = await reader
      .select(
        `${tables.customers}.first_name`,
        `${tables.customers}.last_name`,
        `${tables.customers}.email`,
        `${tables.customers}.phone_number`,
        `${tables.customers}.address_line_1 as address_line_one`,
        `${tables.customers}.address_line_2 as address_line_two`,
        `${tables.customers}.city`,
        `${tables.customers}.state`,
        `${tables.customers}.zip_code`,
        `${tables.orders}.order_code`,
        `${tables.orders}.status as order_status`,
        `${tables.orders}.timestamp as timestamp`,
        `${tables.orders}.id as order_id`,
        `${tables.orders}.note as order_note`,
        `${tables.payments}.amount as payment_amount`,
        `${tables.shipments}.status as shipment_status`,
        `${tables.shipments}.tracking_number as shipment_tracking_number`,
        `${tables.shipments}.not_shipping as not_shipping`
      )
      .from(tables.orders)
      .join(
        tables.customers,
        `${tables.customers}.order_id`,
        "=",
        `${tables.orders}.id`
      )
      .join(
        tables.payments,
        `${tables.payments}.order_id`,
        "=",
        `${tables.orders}.id`
      )
      .join(
        tables.shipments,
        `${tables.shipments}.order_id`,
        "=",
        `${tables.orders}.id`
      )
      .orderByRaw("timestamp DESC")
      .where(`${tables.orders}.status`, 4)
      .where(`${tables.orders}.id`, id);
  } catch (e) {
    throw new Error("Error getting order.");
  }

  const createOrderObject = async item => {
    return {
      ...item,
      timestamp: new Date(item.timestamp).getTime(0),
      seats: await getOrderSeats(item.order_id)
    };
  };
  const order = await Promise.all(
    orderRaw.map(item => createOrderObject(item))
  );
  console.log(order);
  return order[0];
};
