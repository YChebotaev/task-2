import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('uploads', table => {
    table.increments('id')

    table.string('filename')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('uploads')
