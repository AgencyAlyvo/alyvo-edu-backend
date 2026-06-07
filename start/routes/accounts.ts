import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ManagedAccountsController = () => import('#controllers/managed_accounts_controller')

router
  .group(() => {
    router.get('/', [ManagedAccountsController, 'index'])
    router.post('/', [ManagedAccountsController, 'store'])
    router.get('/:id', [ManagedAccountsController, 'show'])
    router.patch('/:id', [ManagedAccountsController, 'update'])
    router.delete('/:id', [ManagedAccountsController, 'destroy'])
  })
  .prefix('/accounts')
  .use(middleware.auth({ guards: ['api'] }))
