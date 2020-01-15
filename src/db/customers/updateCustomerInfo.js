const { writer, reader } = require("../pool");
const tables = require("../tables");

module.exports = async data => {
  console.log("update");
  try {
    await writer(tables.customers)
      .where("order_id", data.orderId)
      .update({
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
  } catch (e) {
    console.log("Error adding customer data: ", e);
    throw new Error("Error adding customer data");
  }
  return;
};
