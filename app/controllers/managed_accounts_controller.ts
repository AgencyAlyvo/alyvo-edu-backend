import type { MybcScreenshotKind } from '#constants/account_storage'
import BadRequestException from '#exceptions/bad_request_exception'
import NotFoundException from '#exceptions/not_found_exception'
import type ManagedAccount from '#models/managed_account'
import ManagedAccountService, { type ManagedAccountFilter } from '#services/managed_account_service'
import ManagedAccountStorageS3Service from '#services/managed_account_storage_s3_service'
import ManagedAccountTransformer from '#transformers/managed_account_transformer'
import type { CreateManagedAccountPayload } from '#types/payload/create_managed_account_payload'
import type { UpdateManagedAccountPayload } from '#types/payload/update_managed_account_payload'
import type { ManagedAccountResponse } from '#types/response/managed_account_response'
import type { UploadMybcScreenshotsPayload } from '#types/payload/upload_mybc_screenshots_payload'
import {
  createManagedAccountValidator,
  listManagedAccountsValidator,
  updateManagedAccountValidator,
  uploadMybcScreenshotsValidator,
} from '#validators/managed_account_validator'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * CRUD des comptes geres (Outlook / ecole / Cursor) par admin.
 */
export default class ManagedAccountsController {
  /**
   * @accounts
   * @summary Liste les comptes geres de l'admin connecte
   * @responseBody 200 - <ManagedAccountResponse[]> - Liste des comptes
   */
  public async index({ request, auth, serialize }: HttpContext): Promise<{ data: ManagedAccountResponse[] }> {
    const { filter } = await request.validateUsing(listManagedAccountsValidator)
    const activeFilter: ManagedAccountFilter = filter ?? 'all'
    const accounts: ManagedAccount[] = await ManagedAccountService.list(auth, activeFilter)

    return serialize(ManagedAccountTransformer.transform(accounts))
  }

  /**
   * @accounts
   * @summary Detail d'un compte gere
   * @responseBody 200 - <ManagedAccountResponse> - Compte trouve
   * @responseBody 404 - <ErrorResponseBody> - Compte introuvable
   */
  public async show({ params, auth, serialize }: HttpContext): Promise<{ data: ManagedAccountResponse }> {
    const account: ManagedAccount = await ManagedAccountService.findForAdmin(auth, Number(params.id))

    return serialize(ManagedAccountTransformer.transform(account))
  }

  /**
   * @accounts
   * @summary Cree un compte gere
   * @requestBody <CreateManagedAccountPayload>
   * @responseBody 200 - <ManagedAccountResponse> - Compte cree
   * @responseBody 409 - <ErrorResponseBody> - Email deja utilise
   */
  public async store({ request, auth, serialize }: HttpContext): Promise<{ data: ManagedAccountResponse }> {
    const payload: CreateManagedAccountPayload = await request.validateUsing(createManagedAccountValidator)
    const account: ManagedAccount = await ManagedAccountService.create(auth, payload)

    return serialize(ManagedAccountTransformer.transform(account))
  }

  /**
   * @accounts
   * @summary Met a jour un compte gere
   * @requestBody <UpdateManagedAccountPayload>
   * @responseBody 200 - <ManagedAccountResponse> - Compte mis a jour
   */
  public async update({ params, request, auth, serialize }: HttpContext): Promise<{ data: ManagedAccountResponse }> {
    const payload: UpdateManagedAccountPayload = await request.validateUsing(updateManagedAccountValidator)
    const account: ManagedAccount = await ManagedAccountService.update(auth, Number(params.id), payload)

    return serialize(ManagedAccountTransformer.transform(account))
  }

  /**
   * @accounts
   * @summary Supprime un compte gere
   * @responseBody 204 - Compte supprime
   */
  public async destroy({ params, auth, response }: HttpContext): Promise<void> {
    await ManagedAccountService.destroy(auth, Number(params.id))
    response.noContent()
  }

  /**
   * @accounts
   * @summary Envoie les captures myBC (PNG base64) vers S3
   */
  public async uploadMybcScreenshots({
    params,
    request,
    auth,
    serialize,
  }: HttpContext): Promise<{ data: ManagedAccountResponse }> {
    const payload: UploadMybcScreenshotsPayload = await request.validateUsing(uploadMybcScreenshotsValidator)

    let studentHomeBuffer: Buffer
    let prospectMenuBuffer: Buffer
    let registrationStatusBuffer: Buffer

    try {
      studentHomeBuffer = Buffer.from(payload.studentHomeBase64, 'base64')
      prospectMenuBuffer = Buffer.from(payload.prospectMenuBase64, 'base64')
      registrationStatusBuffer = Buffer.from(payload.registrationStatusBase64, 'base64')
    } catch {
      throw new BadRequestException('Invalid base64 screenshot payload')
    }

    if (studentHomeBuffer.length === 0 || prospectMenuBuffer.length === 0 || registrationStatusBuffer.length === 0) {
      throw new BadRequestException('Screenshot payloads cannot be empty')
    }

    const account: ManagedAccount = await ManagedAccountService.storeMybcScreenshots(
      auth,
      Number(params.id),
      studentHomeBuffer,
      prospectMenuBuffer,
      registrationStatusBuffer,
    )

    return serialize(ManagedAccountTransformer.transform(account))
  }

  /**
   * @accounts
   * @summary Telecharge une capture myBC depuis S3
   */
  public async downloadMybcScreenshot(ctx: HttpContext): Promise<void> {
    const { params, auth } = ctx
    const kind: string = String(params.kind || '')
    const allowedKinds: MybcScreenshotKind[] = ['student-home', 'prospect-menu', 'registration-status']

    if (!allowedKinds.includes(kind as MybcScreenshotKind)) {
      throw new BadRequestException('Invalid screenshot kind')
    }

    const account: ManagedAccount = await ManagedAccountService.findForAdmin(auth, Number(params.id))
    const keyByKind: Record<MybcScreenshotKind, string | null> = {
      'student-home': account.mybcScreenshotHomeKey,
      'prospect-menu': account.mybcScreenshotProspectKey,
      'registration-status': account.mybcScreenshotRegistrationKey,
    }
    const key: string | null = keyByKind[kind as MybcScreenshotKind]

    if (!key) {
      throw new NotFoundException('Screenshot not found for this account')
    }

    const downloadNameByKind: Record<MybcScreenshotKind, string> = {
      'student-home': `mybc-student-home-${account.id}.png`,
      'prospect-menu': `mybc-prospect-menu-${account.id}.png`,
      'registration-status': `mybc-registration-status-${account.id}.png`,
    }
    const downloadName: string = downloadNameByKind[kind as MybcScreenshotKind]

    await ManagedAccountStorageS3Service.streamDownload(ctx, key, downloadName)
  }

  /**
   * @accounts
   * @summary Supprime une capture myBC (S3 + base)
   */
  public async deleteMybcScreenshot({
    params,
    auth,
    serialize,
  }: HttpContext): Promise<{ data: ManagedAccountResponse }> {
    const kind: string = String(params.kind || '')
    const allowedKinds: MybcScreenshotKind[] = ['student-home', 'prospect-menu', 'registration-status']

    if (!allowedKinds.includes(kind as MybcScreenshotKind)) {
      throw new BadRequestException('Invalid screenshot kind')
    }

    const account: ManagedAccount = await ManagedAccountService.deleteMybcScreenshot(
      auth,
      Number(params.id),
      kind as MybcScreenshotKind,
    )

    return serialize(ManagedAccountTransformer.transform(account))
  }
}
