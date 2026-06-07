import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Exception levee quand la combinaison prenom + nom Outlook existe deja.
 */
export default class AccountOutlookNameConflictException extends Exception {
  public static status: number = 409
  public static code: string = 'E_ACCOUNT_OUTLOOK_NAME_CONFLICT'

  /**
   * @param message - Message detaille.
   */
  constructor(message: string = 'Outlook first and last name combination is already used') {
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
