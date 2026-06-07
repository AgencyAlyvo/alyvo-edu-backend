import AccountEmailConflictException from '#exceptions/account_email_conflict_exception'
import AccountOutlookNameConflictException from '#exceptions/account_outlook_name_conflict_exception'
import NotFoundException from '#exceptions/not_found_exception'
import ManagedAccount from '#models/managed_account'
import type User from '#models/user'
import type { CreateManagedAccountPayload } from '#types/payload/create_managed_account_payload'
import type { UpdateManagedAccountPayload } from '#types/payload/update_managed_account_payload'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

/** Filtre de liste des comptes geres. */
export type ManagedAccountFilter = 'all' | 'school_active' | 'school_inactive' | 'cursor_active' | 'cursor_inactive'

/**
 * Service metier des comptes geres par admin.
 */
export default class ManagedAccountService {
  /**
   * Liste les comptes de l'admin connecte avec filtre optionnel.
   */
  public static async list(auth: HttpContext['auth'], filter: ManagedAccountFilter = 'all'): Promise<ManagedAccount[]> {
    const admin: User = auth.getUserOrFail()
    const query: ReturnType<typeof ManagedAccount.query> = ManagedAccount.query().where('adminUserId', admin.id)

    switch (filter) {
      case 'school_active':
        query.where('schoolEmailActivated', true)
        break
      case 'school_inactive':
        query.where('schoolEmailActivated', false)
        break
      case 'cursor_active':
        query.where('cursorAccountActivated', true)
        break
      case 'cursor_inactive':
        query.where('cursorAccountActivated', false)
        break
      case 'all':
      default:
        break
    }

    return (await query.orderBy('createdAt', 'desc')) as ManagedAccount[]
  }

  /**
   * Recupere un compte par id pour l'admin connecte.
   */
  public static async findForAdmin(auth: HttpContext['auth'], id: number): Promise<ManagedAccount> {
    const admin: User = auth.getUserOrFail()
    const account: ManagedAccount | null = await ManagedAccount.query()
      .where('id', id)
      .where('adminUserId', admin.id)
      .first()

    if (!account) {
      throw new NotFoundException('Managed account not found')
    }

    return account
  }

  /**
   * Cree un compte gere pour l'admin connecte.
   */
  public static async create(auth: HttpContext['auth'], payload: CreateManagedAccountPayload): Promise<ManagedAccount> {
    const admin: User = auth.getUserOrFail()

    const account: ManagedAccount = new ManagedAccount()
    account.adminUserId = admin.id
    account.outlookEmail = payload.outlookEmail ?? null
    account.outlookFirstName = payload.outlookFirstName ?? null
    account.outlookLastName = payload.outlookLastName ?? null
    account.outlookEmailPassword = payload.outlookEmailPassword ?? null
    account.birthday = this.parseBirthday(payload.birthday)
    account.schoolEmail = payload.schoolEmail ?? null
    account.cursorPassword = payload.cursorPassword ?? null
    account.studentId = payload.studentId ?? null
    account.schoolEmailPassword = payload.schoolEmailPassword ?? null
    account.schoolEmailActivated = payload.schoolEmailActivated ?? false
    account.schoolRequestSent = payload.schoolRequestSent ?? false
    account.cursorAccountActivated = payload.cursorAccountActivated ?? false
    account.cursorSheeridRequestSent = payload.cursorSheeridRequestSent ?? false

    this.applyActivationDates(account, {
      schoolEmailActivated: account.schoolEmailActivated,
      cursorAccountActivated: account.cursorAccountActivated,
      schoolEmailActivatedAt: payload.schoolEmailActivatedAt,
      cursorAccountActivatedAt: payload.cursorAccountActivatedAt,
    })
    this.applyRequestSentDates(account, {
      schoolRequestSent: account.schoolRequestSent,
      cursorSheeridRequestSent: account.cursorSheeridRequestSent,
      schoolRequestSentAt: payload.schoolRequestSentAt,
      cursorSheeridRequestSentAt: payload.cursorSheeridRequestSentAt,
    })

    await this.assertOutlookNamePairAvailable(admin.id, account.outlookFirstName, account.outlookLastName)

    try {
      await account.save()
    } catch (error: unknown) {
      this.rethrowUniqueViolation(error)
      throw error
    }

    return account
  }

  /**
   * Met a jour un compte gere.
   */
  public static async update(
    auth: HttpContext['auth'],
    id: number,
    payload: UpdateManagedAccountPayload,
  ): Promise<ManagedAccount> {
    const account: ManagedAccount = await this.findForAdmin(auth, id)

    if (payload.outlookEmail !== undefined) {
      account.outlookEmail = payload.outlookEmail
    }
    if (payload.outlookFirstName !== undefined) {
      account.outlookFirstName = payload.outlookFirstName
    }
    if (payload.outlookLastName !== undefined) {
      account.outlookLastName = payload.outlookLastName
    }
    if (payload.outlookEmailPassword !== undefined) {
      account.outlookEmailPassword = payload.outlookEmailPassword
    }
    if (payload.birthday !== undefined) {
      account.birthday = this.parseBirthday(payload.birthday)
    }
    if (payload.schoolEmail !== undefined) {
      account.schoolEmail = payload.schoolEmail
    }
    if (payload.cursorPassword !== undefined) {
      account.cursorPassword = payload.cursorPassword
    }
    if (payload.studentId !== undefined) {
      account.studentId = payload.studentId
    }
    if (payload.schoolEmailPassword !== undefined) {
      account.schoolEmailPassword = payload.schoolEmailPassword
    }

    const previousSchoolActivated: boolean = account.schoolEmailActivated
    const previousCursorActivated: boolean = account.cursorAccountActivated
    const previousSchoolRequestSent: boolean = account.schoolRequestSent
    const previousCursorSheeridRequestSent: boolean = account.cursorSheeridRequestSent

    if (payload.schoolEmailActivated !== undefined) {
      account.schoolEmailActivated = payload.schoolEmailActivated
    }
    if (payload.schoolRequestSent !== undefined) {
      account.schoolRequestSent = payload.schoolRequestSent
    }
    if (payload.cursorAccountActivated !== undefined) {
      account.cursorAccountActivated = payload.cursorAccountActivated
    }
    if (payload.cursorSheeridRequestSent !== undefined) {
      account.cursorSheeridRequestSent = payload.cursorSheeridRequestSent
    }

    await this.assertOutlookNamePairAvailable(
      account.adminUserId,
      account.outlookFirstName,
      account.outlookLastName,
      account.id,
    )

    this.applyActivationDates(account, {
      schoolEmailActivated: account.schoolEmailActivated,
      cursorAccountActivated: account.cursorAccountActivated,
      previousSchoolActivated,
      previousCursorActivated,
      schoolEmailActivatedAt: payload.schoolEmailActivatedAt,
      cursorAccountActivatedAt: payload.cursorAccountActivatedAt,
    })
    this.applyRequestSentDates(account, {
      schoolRequestSent: account.schoolRequestSent,
      cursorSheeridRequestSent: account.cursorSheeridRequestSent,
      previousSchoolRequestSent,
      previousCursorSheeridRequestSent,
      schoolRequestSentAt: payload.schoolRequestSentAt,
      cursorSheeridRequestSentAt: payload.cursorSheeridRequestSentAt,
    })

    try {
      await account.save()
    } catch (error: unknown) {
      this.rethrowUniqueViolation(error)
      throw error
    }

    return account
  }

  /**
   * Supprime un compte gere.
   */
  public static async destroy(auth: HttpContext['auth'], id: number): Promise<void> {
    const account: ManagedAccount = await this.findForAdmin(auth, id)
    await account.delete()
  }

  /**
   * Parse une date ISO (YYYY-MM-DD) pour stockage en base.
   */
  private static parseBirthday(value: string | null | undefined): DateTime | null {
    if (!value) {
      return null
    }

    const parsed: DateTime = DateTime.fromISO(value, { zone: 'utc' })

    if (!parsed.isValid) {
      return null
    }

    return parsed.startOf('day')
  }

  /**
   * Parse une date/heure ISO pour stockage en base.
   */
  private static parseDateTime(value: string | null | undefined): DateTime | null {
    if (!value) {
      return null
    }

    const parsed: DateTime = DateTime.fromISO(value, { zone: 'utc' })

    if (!parsed.isValid) {
      return null
    }

    return parsed
  }

  /**
   * Met a jour les dates d'activation selon les flags.
   */
  private static applyActivationDates(
    account: ManagedAccount,
    options: {
      schoolEmailActivated: boolean
      cursorAccountActivated: boolean
      previousSchoolActivated?: boolean
      previousCursorActivated?: boolean
      schoolEmailActivatedAt?: string | null
      cursorAccountActivatedAt?: string | null
    },
  ): void {
    const schoolChanged: boolean =
      options.previousSchoolActivated === undefined || options.previousSchoolActivated !== options.schoolEmailActivated
    const cursorChanged: boolean =
      options.previousCursorActivated === undefined ||
      options.previousCursorActivated !== options.cursorAccountActivated

    if (options.schoolEmailActivatedAt !== undefined) {
      account.schoolEmailActivatedAt = this.parseDateTime(options.schoolEmailActivatedAt)
    } else if (schoolChanged) {
      if (options.schoolEmailActivated) {
        if (!account.schoolEmailActivatedAt) {
          account.schoolEmailActivatedAt = DateTime.now()
        }
      } else {
        account.schoolEmailActivatedAt = null
      }
    }

    if (options.cursorAccountActivatedAt !== undefined) {
      account.cursorAccountActivatedAt = this.parseDateTime(options.cursorAccountActivatedAt)
    } else if (cursorChanged) {
      if (options.cursorAccountActivated) {
        if (!account.cursorAccountActivatedAt) {
          account.cursorAccountActivatedAt = DateTime.now()
        }
      } else {
        account.cursorAccountActivatedAt = null
      }
    }
  }

  /**
   * Met a jour les dates d'envoi de demande selon les flags.
   */
  private static applyRequestSentDates(
    account: ManagedAccount,
    options: {
      schoolRequestSent: boolean
      cursorSheeridRequestSent: boolean
      previousSchoolRequestSent?: boolean
      previousCursorSheeridRequestSent?: boolean
      schoolRequestSentAt?: string | null
      cursorSheeridRequestSentAt?: string | null
    },
  ): void {
    const schoolRequestChanged: boolean =
      options.previousSchoolRequestSent === undefined || options.previousSchoolRequestSent !== options.schoolRequestSent
    const cursorSheeridRequestChanged: boolean =
      options.previousCursorSheeridRequestSent === undefined ||
      options.previousCursorSheeridRequestSent !== options.cursorSheeridRequestSent

    if (options.schoolRequestSentAt !== undefined) {
      account.schoolRequestSentAt = this.parseDateTime(options.schoolRequestSentAt)
    } else if (schoolRequestChanged) {
      if (options.schoolRequestSent) {
        if (!account.schoolRequestSentAt) {
          account.schoolRequestSentAt = DateTime.now()
        }
      } else {
        account.schoolRequestSentAt = null
      }
    }

    if (options.cursorSheeridRequestSentAt !== undefined) {
      account.cursorSheeridRequestSentAt = this.parseDateTime(options.cursorSheeridRequestSentAt)
    } else if (cursorSheeridRequestChanged) {
      if (options.cursorSheeridRequestSent) {
        if (!account.cursorSheeridRequestSentAt) {
          account.cursorSheeridRequestSentAt = DateTime.now()
        }
      } else {
        account.cursorSheeridRequestSentAt = null
      }
    }
  }

  /**
   * Normalise un segment de nom Outlook pour comparaison (casse / espaces).
   */
  private static normalizeOutlookNamePart(value: string | null | undefined): string | null {
    const trimmed: string | undefined = value?.trim()

    if (!trimmed) {
      return null
    }

    return trimmed.toLowerCase()
  }

  /**
   * Interdit une combinaison prenom + nom Outlook deja presente pour l'admin.
   */
  private static async assertOutlookNamePairAvailable(
    adminUserId: number,
    firstName: string | null | undefined,
    lastName: string | null | undefined,
    excludeAccountId?: number,
  ): Promise<void> {
    const normalizedFirst: string | null = this.normalizeOutlookNamePart(firstName)
    const normalizedLast: string | null = this.normalizeOutlookNamePart(lastName)

    if (!normalizedFirst || !normalizedLast) {
      return
    }

    const query: ReturnType<typeof ManagedAccount.query> = ManagedAccount.query()
      .where('adminUserId', adminUserId)
      .whereRaw('LOWER(TRIM(outlook_first_name)) = ?', [normalizedFirst])
      .whereRaw('LOWER(TRIM(outlook_last_name)) = ?', [normalizedLast])

    if (excludeAccountId !== undefined) {
      query.whereNot('id', excludeAccountId)
    }

    const existing: ManagedAccount | null = (await query.first()) as ManagedAccount | null

    if (existing) {
      throw new AccountOutlookNameConflictException(
        'Outlook first and last name combination is already used on another account',
      )
    }
  }

  /**
   * Convertit une violation d'unicite PostgreSQL en 409.
   */
  private static rethrowUniqueViolation(error: unknown): void {
    const message: string = error instanceof Error ? error.message : String(error)

    if (message.includes('outlook_email') || message.includes('managed_accounts_outlook_email_unique')) {
      throw new AccountEmailConflictException('Outlook email is already used')
    }

    if (message.includes('school_email') || message.includes('managed_accounts_school_email_unique')) {
      throw new AccountEmailConflictException('School email is already used')
    }
  }
}
