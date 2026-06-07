/**
 * Payload de mise a jour d'un compte gere.
 */
export type UpdateManagedAccountPayload = {
  outlookEmail?: string | null
  outlookFirstName?: string | null
  outlookLastName?: string | null
  outlookEmailPassword?: string | null
  birthday?: string | null
  schoolEmail?: string | null
  cursorPassword?: string | null
  studentId?: string | null
  schoolEmailPassword?: string | null
  schoolEmailActivated?: boolean
  schoolRequestSent?: boolean
  cursorAccountActivated?: boolean
  cursorSheeridRequestSent?: boolean
  schoolEmailActivatedAt?: string | null
  schoolRequestSentAt?: string | null
  cursorAccountActivatedAt?: string | null
  cursorSheeridRequestSentAt?: string | null
}
