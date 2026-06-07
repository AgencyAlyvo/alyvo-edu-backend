import env from '#start/env'

const SOFTWARE_STORAGE_PREFIX_BY_NODE_ENV: Record<string, string> = {
  production: 'edu/prod/software',
  staging: 'edu/staging/software',
  development: 'edu/staging/software',
  test: 'edu/staging/software',
}

/**
 * Prefixe S3 des binaires et manifestes Alyvo Edu (aligne sur la CI du desktop).
 */
export function resolveSoftwareStoragePrefix(): string {
  const configuredPrefix: string | undefined = env.get('S3_SOFTWARE_PREFIX')

  if (configuredPrefix?.trim()) {
    return configuredPrefix.replace(/^\/+|\/+$/g, '')
  }

  return SOFTWARE_STORAGE_PREFIX_BY_NODE_ENV[env.get('NODE_ENV')] ?? 'edu/staging/software'
}

/**
 * Cle S3 du manifeste Tauri updater.
 */
export function resolveUpdaterManifestKey(): string {
  return `${resolveSoftwareStoragePrefix()}/updater/updater-manifest.json`
}

/**
 * Cle S3 d'un binaire de mise a jour.
 */
export function resolveSoftwareDownloadKey(nameBundle: string): string {
  const safeName: string = nameBundle.replace(/^\/+/, '').replace(/\.\./g, '')

  return `${resolveSoftwareStoragePrefix()}/download/${safeName}`
}
