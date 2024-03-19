import path from 'node:path'
import { type Knex } from "knex";

export default {
  client: "sqlite3",
  connection: {
    filename: path.join(__dirname, "dev.sqlite3"),
  },
  useNullAsDefault: true,
} satisfies Knex.Config;
