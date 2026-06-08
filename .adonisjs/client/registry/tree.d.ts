/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  health: typeof routes['health']
  auth: {
    signIn: typeof routes['auth.sign_in']
    signUp: typeof routes['auth.sign_up']
    logout: typeof routes['auth.logout']
  }
  managedAccounts: {
    index: typeof routes['managed_accounts.index']
    store: typeof routes['managed_accounts.store']
    show: typeof routes['managed_accounts.show']
    update: typeof routes['managed_accounts.update']
    uploadMybcScreenshots: typeof routes['managed_accounts.upload_mybc_screenshots']
    downloadMybcScreenshot: typeof routes['managed_accounts.download_mybc_screenshot']
    deleteMybcScreenshot: typeof routes['managed_accounts.delete_mybc_screenshot']
    destroy: typeof routes['managed_accounts.destroy']
  }
  software: {
    updaterManifest: typeof routes['software.updater_manifest']
    download: typeof routes['software.download']
  }
}
