import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'health': { paramsTuple?: []; params?: {} }
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'managed_accounts.index': { paramsTuple?: []; params?: {} }
    'managed_accounts.store': { paramsTuple?: []; params?: {} }
    'managed_accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'managed_accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'managed_accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'software.updater_manifest': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'target': ParamValue,'arch': ParamValue,'currentVersion': ParamValue} }
    'software.download': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
  }
  GET: {
    'health': { paramsTuple?: []; params?: {} }
    'managed_accounts.index': { paramsTuple?: []; params?: {} }
    'managed_accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'software.updater_manifest': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'target': ParamValue,'arch': ParamValue,'currentVersion': ParamValue} }
    'software.download': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
  }
  HEAD: {
    'health': { paramsTuple?: []; params?: {} }
    'managed_accounts.index': { paramsTuple?: []; params?: {} }
    'managed_accounts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'software.updater_manifest': { paramsTuple: [ParamValue,ParamValue,ParamValue]; params: {'target': ParamValue,'arch': ParamValue,'currentVersion': ParamValue} }
    'software.download': { paramsTuple: [ParamValue]; params: {'nameBundle': ParamValue} }
  }
  POST: {
    'auth.sign_in': { paramsTuple?: []; params?: {} }
    'auth.sign_up': { paramsTuple?: []; params?: {} }
    'managed_accounts.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'auth.logout': { paramsTuple?: []; params?: {} }
    'managed_accounts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'managed_accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}