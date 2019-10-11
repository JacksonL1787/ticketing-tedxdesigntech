const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    database : 'ticketing'
  }
})

let seatsPerRow = 30
let vipRows = ['A','B','C']
let rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']



const createSeats = () => {
  let seats = []
  rowNames.forEach((row, i) => {
    for(let a = 1; a <= seatsPerRow;a++) {
      let tempSeat;
      seats.push({
        name: row + a,
        type: vipRows.includes(row) ? 2 : 1
      })
    }
  })
  return seats
}

knex('seats').insert(createSeats()).returning('*').then(console.log)
