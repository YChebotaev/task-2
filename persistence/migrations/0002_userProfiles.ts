import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userProfiles", (table) => {
    table.increments("id");

    table.integer('userId')

    table.string("bio")
    table.string("firstName")
    table.string("lastName")
    table.bigInteger('dateOfBirth')
    table.string('country')
    table.string('city')

    table.foreign("userId").references("id").inTable("users");

    table.index('userId')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userProfiles");
