import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'managed_accounts'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('mybc_screenshot_home_key', 512).nullable()
      table.string('mybc_screenshot_prospect_key', 512).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('mybc_screenshot_home_key')
      table.dropColumn('mybc_screenshot_prospect_key')
    })
  }
}
