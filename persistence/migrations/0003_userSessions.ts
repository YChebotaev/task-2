import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userSessions", (table) => {
    table.increments("id");

    table.integer("userId")

    table.string('accessToken')

    table.foreign("userId").references("id").inTable("users");

    table.index('userId')
    table.index('accessToken')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userSessions");
