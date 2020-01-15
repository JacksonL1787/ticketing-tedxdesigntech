const reader = require("../pool").reader;
const tables = require("../tables");

module.exports = async () => {
  const seatPricesDb = await reader
    .select("name", "price", "fee")
    .from("seat_types");
  const seatPrices = {};
  seatPricesDb.forEach(
    sp => (seatPrices[sp.name] = { price: sp.price, fee: sp.fee })
  );
  return seatPrices;
};
