const getTakenSeats = require('./seats/getTakenSeats');
const getSeatPrices = require('./seatTypes/getSeatPrices');

(async function() {
  const prices = await getSeatPrices()
  console.log(prices)
})();
