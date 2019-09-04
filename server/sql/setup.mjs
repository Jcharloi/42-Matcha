const pgtools = require("pgtools");
const pg = require("pg");
const fs = require("fs");

const { Client } = pg;
const sql = fs.readFileSync("./setup.sql").toString();

const { user, password } = require("../dbKeys.json");

console.log("Starting setting up database : dropping old database if existing");
return pgtools
  .dropdb({ user, host: "localhost", password, port: 5432 }, "matcha")
  .then(() => {
    console.log("Old database dropped\nSetting up new database");
    return pgtools.createdb(
      { user, host: "localhost", password, port: 5432 },
      "matcha"
    );
  })
  .then(async () => {
    console.log("New database set up\nPopulating with columns");
    const client = new Client({
      user,
      host: "localhost",
      database: "matcha",
      password,
      port: 5432
    });
    await client.connect();
    await client.query(sql);
    //add tags;
    await client.end();
    console.log("Database populated\nAll done");
  });
