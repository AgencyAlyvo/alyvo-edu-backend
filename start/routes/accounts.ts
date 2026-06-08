import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ManagedAccountsController = () => import('#controllers/managed_accounts_controller')

router
  .group(() => {
    router.get('/', [ManagedAccountsController, 'index'])
    router.post('/', [ManagedAccountsController, 'store'])
    router.get('/:id', [ManagedAccountsController, 'show'])
    router.patch('/:id', [ManagedAccountsController, 'update'])
    router.post('/:id/mybc-screenshots', [ManagedAccountsController, 'uploadMybcScreenshots'])
    router.get('/:id/mybc-screenshots/:kind', [ManagedAccountsController, 'downloadMybcScreenshot'])
    router.delete('/:id/mybc-screenshots/:kind', [ManagedAccountsController, 'deleteMybcScreenshot'])
    router.delete('/:id', [ManagedAccountsController, 'destroy'])
  })
  .prefix('/accounts')
  .use(middleware.auth({ guards: ['api'] }))
