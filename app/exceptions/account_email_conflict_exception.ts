import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Exception levee quand un email outlook ou ecole est deja utilise.
 */
export default class AccountEmailConflictException extends Exception {
  public static status: number = 409
  public static code: string = 'E_ACCOUNT_EMAIL_CONFLICT'

  /**
   * Cree l'exception de conflit email.
   * @param {string} message - Message detaille.
   */
  constructor(message: string = 'Email already used for another account') {
    super(message)
  }

  /**
   * Gere l'exception en renvoyant une reponse JSON.
   */
  public handle(error: this, ctx: HttpContext): void {
    ctx.response.status(error.status).send({
      code: error.code,
      message: error.message,
    })
  }
}
