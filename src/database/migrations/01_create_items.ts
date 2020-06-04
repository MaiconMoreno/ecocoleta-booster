import Knex from 'knex';

export async function up(knex: Knex) {
    // criação das tabelas
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    })
};

export async function down(knex: Knex) {
    // deletar tabela

    return knex.schema.dropTable('items');

}