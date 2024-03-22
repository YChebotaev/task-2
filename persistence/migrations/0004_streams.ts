import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("streams", (table) => {
    table.increments("id")

    table.string('title')
    table.string('slug').unique()

    table.index('title')
    table.index('slug')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("streams")
