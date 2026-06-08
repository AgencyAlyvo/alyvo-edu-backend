/**
 * Compte gere expose a l'API.
 */
export type ManagedAccountResponse = {
  id: number
  outlookEmail: string | null
  outlookFirstName: string | null
  outlookLastName: string | null
  outlookEmailPassword: string | null
  birthday: string | null
  schoolEmail: string | null
  cursorPassword: string | null
  studentId: string | null
  mybcScreenshotHomeKey: string | null
  mybcScreenshotProspectKey: string | null
  mybcScreenshotRegistrationKey: string | null
  hasMybcScreenshots: boolean
  schoolEmailPassword: string | null
  schoolEmailActivated: boolean
  schoolRequestSent: boolean
  cursorAccountActivated: boolean
  cursorSheeridRequestSent: boolean
  schoolEmailActivatedAt: string | null
  schoolRequestSentAt: string | null
  cursorAccountActivatedAt: string | null
  cursorSheeridRequestSentAt: string | null
  createdAt: string
  updatedAt: string | null
}
