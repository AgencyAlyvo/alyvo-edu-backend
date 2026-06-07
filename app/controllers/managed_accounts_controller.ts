import type ManagedAccount from '#models/managed_account'
import ManagedAccountService, { type ManagedAccountFilter } from '#services/managed_account_service'
import ManagedAccountTransformer from '#transformers/managed_account_transformer'
import type { CreateManagedAccountPayload } from '#types/payload/create_managed_account_payload'
import type { UpdateManagedAccountPayload } from '#types/payload/update_managed_account_payload'
import type { ManagedAccountResponse } from '#types/response/managed_account_response'
import {
  createManagedAccountValidator,
  listManagedAccountsValidator,
  updateManagedAccountValidator,
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
}
