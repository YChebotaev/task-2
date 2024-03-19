import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");

    table.string("username").unique()
    table.string("email").unique()
    table.string('coverSrc').nullable()
    table.string('avatarSrc').nullable()
    table.string("passwordHash")
    table.string("passwordSalt")

    table.index('username')
    table.index('email')
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("users");
