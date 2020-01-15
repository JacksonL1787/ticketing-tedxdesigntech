const knex = require("knex");

module.exports = {
  reader: knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      database: "ticketing"
    }
  }),
  writer: knex({
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: "postgres",
      database: "ticketing"
    }
  })
};
