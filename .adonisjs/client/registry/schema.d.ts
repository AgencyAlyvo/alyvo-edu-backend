/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'health': {
    methods: ["GET","HEAD"]
    pattern: '/health'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/health_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/health_controller').default['handle']>>>
    }
  }
  'auth.sign_in': {
    methods: ["POST"]
    pattern: '/signin'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').signInValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').signInValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signIn']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.sign_up': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth_validator').signUpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth_validator').signUpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signUp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.logout': {
    methods: ["DELETE"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'managed_accounts.index': {
    methods: ["GET","HEAD"]
    pattern: '/accounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/managed_account_validator').listManagedAccountsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'managed_accounts.store': {
    methods: ["POST"]
    pattern: '/accounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/managed_account_validator').createManagedAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/managed_account_validator').createManagedAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'managed_accounts.show': {
    methods: ["GET","HEAD"]
    pattern: '/accounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['show']>>>
    }
  }
  'managed_accounts.update': {
    methods: ["PATCH"]
    pattern: '/accounts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/managed_account_validator').updateManagedAccountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/managed_account_validator').updateManagedAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'managed_accounts.upload_mybc_screenshots': {
    methods: ["POST"]
    pattern: '/accounts/:id/mybc-screenshots'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/managed_account_validator').uploadMybcScreenshotsValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/managed_account_validator').uploadMybcScreenshotsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['uploadMybcScreenshots']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['uploadMybcScreenshots']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'managed_accounts.download_mybc_screenshot': {
    methods: ["GET","HEAD"]
    pattern: '/accounts/:id/mybc-screenshots/:kind'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; kind: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['downloadMybcScreenshot']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['downloadMybcScreenshot']>>>
    }
  }
  'managed_accounts.delete_mybc_screenshot': {
    methods: ["DELETE"]
    pattern: '/accounts/:id/mybc-screenshots/:kind'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { id: ParamValue; kind: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['deleteMybcScreenshot']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['deleteMybcScreenshot']>>>
    }
  }
  'managed_accounts.destroy': {
    methods: ["DELETE"]
    pattern: '/accounts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/managed_accounts_controller').default['destroy']>>>
    }
  }
  'software.updater_manifest': {
    methods: ["GET","HEAD"]
    pattern: '/software/updater/:target/:arch/:currentVersion'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue, ParamValue]
      params: { target: ParamValue; arch: ParamValue; currentVersion: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/software_controller').default['updaterManifest']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/software_controller').default['updaterManifest']>>>
    }
  }
  'software.download': {
    methods: ["GET","HEAD"]
    pattern: '/software/download/:nameBundle'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { nameBundle: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/software_controller').default['download']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/software_controller').default['download']>>>
    }
  }
}
