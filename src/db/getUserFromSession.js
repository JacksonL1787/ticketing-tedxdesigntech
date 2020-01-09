const { reader } = require('./pool')
const tables = require('./tables')

module.exports = async (ss) => {
  let user;
  try {
    user = await reader
      .select(
        `${tables.customers}.id as customer_id`,
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
        `${tables.orders}.timestamp as order_timestamp`,
        `${tables.orders}.id as order_id`)
      .from(tables.orders)
      .join(`${tables.sessions}`, `${tables.sessions}.order_id`, '=', `${tables.orders}.id`)
      .leftJoin(`${tables.customers}`, `${tables.customers}.order_id`, '=', `${tables.orders}.id`)
      .where(`${tables.sessions}.session_string`, ss)
      .whereRaw(`${tables.orders}.timestamp >= now() - interval '15 minutes'`)
  } catch(e) {
    throw new Error(`Database Error: ${e}`)
  }
  return user;
}
