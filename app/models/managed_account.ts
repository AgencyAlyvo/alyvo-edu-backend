import { ManagedAccountSchema } from '#database/schema'
import User from '#models/user'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ManagedAccount extends ManagedAccountSchema {
  @belongsTo(() => User, { foreignKey: 'adminUserId' })
  declare admin: BelongsTo<typeof User>
}
