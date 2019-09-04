import pgtools from "pgtools";
import pg from "pg";
import fs from "fs";
import keys from "./dbKeys.json";

const sql = fs.readFileSync("./sql/setup.sql").toString();
const { user, password } = keys;

const pool = new pg.Pool({
  user: user,
  host: "localhost",
  database: "matcha",
  password: password,
  port: "5432"
});

pgtools
  .dropdb({ user, host: "localhost", password, port: 5432 }, "matcha")
  .then(() => {
    console.log("Old database dropped\nSetting up new database");
    pgtools
      .createdb({ user, host: "localhost", password, port: 5432 }, "matcha")
      .then(() => {
        console.log(
          "New database set up\nPopulating with columns and fakes profiles"
        );
        pool
          .query(sql)
          .then(() => {
            console.log("Database populated\nAll done");
            pool.end();
          })
          .catch(e => {
            console.error(e.stack);
          });
      });
  })
  .catch(e => {
    console.error(e.stack);
  });
