const { writer, reader } = require('../pool')
const tables = require('../tables')

module.exports = async (seats) => {
  let newSeats = [];
  let seatNames = seats.map(obj => obj.name)
  try {
    newSeats = await reader
      .select('id', 'name', 'attendee_name')
      .from(tables.seats)
      .whereIn('name', seatNames)
  } catch(e) {
    throw new Error('Error fetching seat data')
  }

  console.log(await newSeats)
  return await newSeats;
}
