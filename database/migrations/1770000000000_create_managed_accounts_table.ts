import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'managed_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('admin_user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('outlook_email', 254).nullable().unique()
      table.string('outlook_first_name', 100).nullable()
      table.string('outlook_last_name', 100).nullable()
      table.string('outlook_email_password', 255).nullable()
      table.date('birthday').nullable()
      table.string('school_email', 254).nullable().unique()
      table.string('cursor_password', 255).nullable()
      table.string('student_id', 32).nullable()
      table.string('school_email_password', 255).nullable()
      table.boolean('school_email_activated').notNullable().defaultTo(false)
      table.boolean('school_request_sent').notNullable().defaultTo(false)
      table.boolean('cursor_account_activated').notNullable().defaultTo(false)
      table.boolean('cursor_sheerid_request_sent').notNullable().defaultTo(false)
      table.timestamp('school_email_activated_at').nullable()
      table.timestamp('school_request_sent_at').nullable()
      table.timestamp('cursor_account_activated_at').nullable()
      table.timestamp('cursor_sheerid_request_sent_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['admin_user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
