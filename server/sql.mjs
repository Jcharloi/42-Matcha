import pg from "pg";

import keys from "./dbKeys.json";
const { user, password } = keys;

const { Client } = pg;
const client = new Client({
  user,
  host: "localhost",
  database: "matcha",
  password,
  port: 5432
});
client.connect();

export default client;
