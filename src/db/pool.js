const knex = require("knex");
const { databaseDsn } = require("../env");

module.exports = {
  reader: knex({
    client: "pg",
    connection: databaseDsn
  }),
  writer: knex({
    client: "pg",
    connection: databaseDsn
  })
};
