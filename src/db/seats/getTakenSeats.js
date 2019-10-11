const reader = require('../pool').reader
const tables = require('../tables')

module.exports = async () => {
  const takenSeats = await reader.select('name').from(tables.seats).whereNotNull('attendee_name').then(data=>data.map(x=>x.name))
  return takenSeats
}
