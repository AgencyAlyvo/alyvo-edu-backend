import vine from '@vinejs/vine'

const optionalSchoolEmailRule = vine
  .string()
  .trim()
  .email()
  .normalizeEmail()
  .regex(/\.edu$/i)
  .optional()
  .nullable()

const optionalOutlookEmailRule = vine.string().trim().email().normalizeEmail().optional().nullable()

const optionalEmailPasswordRule = vine.string().trim().minLength(1).maxLength(255).optional().nullable()

const optionalOutlookNameRule = vine.string().trim().minLength(1).maxLength(100).optional().nullable()

const optionalBirthdayRule = vine
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .optional()
  .nullable()

const optionalDateTimeRule = vine.string().trim().minLength(1).maxLength(64).optional().nullable()

export const listManagedAccountsValidator = vine.create({
  filter: vine.enum(['all', 'school_active', 'school_inactive', 'cursor_active', 'cursor_inactive']).optional(),
})

const optionalStudentIdRule = vine.string().trim().minLength(1).maxLength(32).optional().nullable()

export const createManagedAccountValidator = vine.create({
  outlookEmail: optionalOutlookEmailRule,
  outlookFirstName: optionalOutlookNameRule,
  outlookLastName: optionalOutlookNameRule,
  outlookEmailPassword: optionalEmailPasswordRule,
  birthday: optionalBirthdayRule,
  schoolEmail: optionalSchoolEmailRule,
  cursorPassword: optionalEmailPasswordRule,
  studentId: optionalStudentIdRule,
  schoolEmailPassword: optionalEmailPasswordRule,
  schoolEmailActivated: vine.boolean().optional(),
  schoolRequestSent: vine.boolean().optional(),
  cursorAccountActivated: vine.boolean().optional(),
  cursorSheeridRequestSent: vine.boolean().optional(),
  schoolEmailActivatedAt: optionalDateTimeRule,
  schoolRequestSentAt: optionalDateTimeRule,
  cursorAccountActivatedAt: optionalDateTimeRule,
  cursorSheeridRequestSentAt: optionalDateTimeRule,
})

export const uploadMybcScreenshotsValidator = vine.create({
  studentHomeBase64: vine.string().trim().minLength(64).maxLength(20_000_000),
  prospectMenuBase64: vine.string().trim().minLength(64).maxLength(20_000_000),
  registrationStatusBase64: vine.string().trim().minLength(64).maxLength(20_000_000),
})

export const updateManagedAccountValidator = vine.create({
  outlookEmail: optionalOutlookEmailRule,
  outlookFirstName: optionalOutlookNameRule,
  outlookLastName: optionalOutlookNameRule,
  outlookEmailPassword: optionalEmailPasswordRule,
  birthday: optionalBirthdayRule,
  schoolEmail: optionalSchoolEmailRule,
  cursorPassword: optionalEmailPasswordRule,
  studentId: optionalStudentIdRule,
  schoolEmailPassword: optionalEmailPasswordRule,
  schoolEmailActivated: vine.boolean().optional(),
  schoolRequestSent: vine.boolean().optional(),
  cursorAccountActivated: vine.boolean().optional(),
  cursorSheeridRequestSent: vine.boolean().optional(),
  schoolEmailActivatedAt: optionalDateTimeRule,
  schoolRequestSentAt: optionalDateTimeRule,
  cursorAccountActivatedAt: optionalDateTimeRule,
  cursorSheeridRequestSentAt: optionalDateTimeRule,
})
