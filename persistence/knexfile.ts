import 'dotenv/config'
import path from "node:path";
import { type Knex } from "knex";

const user = process.env["PG_USER"];
const password = process.env["PG_PASSWORD"];
const database = process.env["PG_DB"]

let config: Knex.Config;

if (user && password && database) {
  config = {
    client: "pg",
    connection: {
      host: "localhost",
      user,
      password,
      database,
    },
  } satisfies Knex.Config;
} else {
  config = {
    client: "sqlite3",
    connection: {
      filename: path.resolve(__dirname, "dev.sqlite3"),
    },
    useNullAsDefault: true
  } satisfies Knex.Config;
}

export default config;
