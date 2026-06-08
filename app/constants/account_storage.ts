import env from '#start/env'

const ACCOUNT_STORAGE_PREFIX_BY_NODE_ENV: Record<string, string> = {
  production: 'edu/prod/accounts',
  staging: 'edu/staging/accounts',
  development: 'edu/dev/accounts',
  test: 'edu/dev/accounts',
}

/**
 * Types de captures myBC.
 */
export type MybcScreenshotKind = 'student-home' | 'prospect-menu' | 'registration-status'

/**
 * Prefixe S3 des assets comptes geres (captures myBC, etc.).
 */
export function resolveManagedAccountStoragePrefix(): string {
  const configuredPrefix: string | undefined = env.get('S3_ACCOUNTS_PREFIX')

  if (configuredPrefix?.trim()) {
    return configuredPrefix.replace(/^\/+|\/+$/g, '')
  }

  return ACCOUNT_STORAGE_PREFIX_BY_NODE_ENV[env.get('NODE_ENV')] ?? 'edu/staging/accounts'
}

/**
 * Cle S3 d'une capture myBC pour un compte gere.
 */
export function resolveMybcScreenshotKey(accountId: number, kind: MybcScreenshotKind): string {
  return `${resolveManagedAccountStoragePrefix()}/${accountId}/mybc-${kind}.png`
}
