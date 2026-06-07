import type { ManagedAccountResponse } from '#types/response/managed_account_response'
import type ManagedAccount from '#models/managed_account'
import { BaseTransformer } from '@adonisjs/core/transformers'

/**
 * Transformer pour les comptes geres.
 */
export default class ManagedAccountTransformer extends BaseTransformer<ManagedAccount> {
  /**
   * Transforme un compte gere en reponse API.
   */
  public toObject(): ManagedAccountResponse {
    return {
      id: this.resource.id,
      outlookEmail: this.resource.outlookEmail,
      outlookFirstName: this.resource.outlookFirstName,
      outlookLastName: this.resource.outlookLastName,
      outlookEmailPassword: this.resource.outlookEmailPassword,
      birthday: this.resource.birthday ? this.resource.birthday.toISODate() : null,
      schoolEmail: this.resource.schoolEmail,
      cursorPassword: this.resource.cursorPassword,
      studentId: this.resource.studentId,
      schoolEmailPassword: this.resource.schoolEmailPassword,
      schoolEmailActivated: this.resource.schoolEmailActivated,
      schoolRequestSent: this.resource.schoolRequestSent,
      cursorAccountActivated: this.resource.cursorAccountActivated,
      cursorSheeridRequestSent: this.resource.cursorSheeridRequestSent,
      schoolEmailActivatedAt: this.resource.schoolEmailActivatedAt
        ? this.resource.schoolEmailActivatedAt.toISO()
        : null,
      schoolRequestSentAt: this.resource.schoolRequestSentAt ? this.resource.schoolRequestSentAt.toISO() : null,
      cursorAccountActivatedAt: this.resource.cursorAccountActivatedAt
        ? this.resource.cursorAccountActivatedAt.toISO()
        : null,
      cursorSheeridRequestSentAt: this.resource.cursorSheeridRequestSentAt
        ? this.resource.cursorSheeridRequestSentAt.toISO()
        : null,
      createdAt: this.resource.createdAt.toISO()!,
      updatedAt: this.resource.updatedAt ? this.resource.updatedAt.toISO() : null,
    }
  }
}
