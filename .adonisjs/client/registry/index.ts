/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'health': {
    methods: ["GET","HEAD"],
    pattern: '/health',
    tokens: [{"old":"/health","type":0,"val":"health","end":""}],
    types: placeholder as Registry['health']['types'],
  },
  'auth.sign_in': {
    methods: ["POST"],
    pattern: '/signin',
    tokens: [{"old":"/signin","type":0,"val":"signin","end":""}],
    types: placeholder as Registry['auth.sign_in']['types'],
  },
  'auth.sign_up': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.sign_up']['types'],
  },
  'auth.logout': {
    methods: ["DELETE"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'managed_accounts.index': {
    methods: ["GET","HEAD"],
    pattern: '/accounts',
    tokens: [{"old":"/accounts","type":0,"val":"accounts","end":""}],
    types: placeholder as Registry['managed_accounts.index']['types'],
  },
  'managed_accounts.store': {
    methods: ["POST"],
    pattern: '/accounts',
    tokens: [{"old":"/accounts","type":0,"val":"accounts","end":""}],
    types: placeholder as Registry['managed_accounts.store']['types'],
  },
  'managed_accounts.show': {
    methods: ["GET","HEAD"],
    pattern: '/accounts/:id',
    tokens: [{"old":"/accounts/:id","type":0,"val":"accounts","end":""},{"old":"/accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['managed_accounts.show']['types'],
  },
  'managed_accounts.update': {
    methods: ["PATCH"],
    pattern: '/accounts/:id',
    tokens: [{"old":"/accounts/:id","type":0,"val":"accounts","end":""},{"old":"/accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['managed_accounts.update']['types'],
  },
  'managed_accounts.destroy': {
    methods: ["DELETE"],
    pattern: '/accounts/:id',
    tokens: [{"old":"/accounts/:id","type":0,"val":"accounts","end":""},{"old":"/accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['managed_accounts.destroy']['types'],
  },
  'software.updater_manifest': {
    methods: ["GET","HEAD"],
    pattern: '/software/updater/:target/:arch/:currentVersion',
    tokens: [{"old":"/software/updater/:target/:arch/:currentVersion","type":0,"val":"software","end":""},{"old":"/software/updater/:target/:arch/:currentVersion","type":0,"val":"updater","end":""},{"old":"/software/updater/:target/:arch/:currentVersion","type":1,"val":"target","end":""},{"old":"/software/updater/:target/:arch/:currentVersion","type":1,"val":"arch","end":""},{"old":"/software/updater/:target/:arch/:currentVersion","type":1,"val":"currentVersion","end":""}],
    types: placeholder as Registry['software.updater_manifest']['types'],
  },
  'software.download': {
    methods: ["GET","HEAD"],
    pattern: '/software/download/:nameBundle',
    tokens: [{"old":"/software/download/:nameBundle","type":0,"val":"software","end":""},{"old":"/software/download/:nameBundle","type":0,"val":"download","end":""},{"old":"/software/download/:nameBundle","type":1,"val":"nameBundle","end":""}],
    types: placeholder as Registry['software.download']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
