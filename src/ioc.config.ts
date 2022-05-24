/**
 * Inversion-of-control configuration.
 * Dependency injection container.
 */

import { Container } from 'inversify'
import { SYMBOLS } from './symbols'
import type { IApi } from './api'
import { Api } from './api'
import type { IBaseController } from './controllers/base-controller'
import { RootController } from './controllers/root-controller'

const container = new Container()

// Add the Api class to the container.
container.bind<IApi>(SYMBOLS.IApi).to(Api)

// Add the controllers to the container.
container.bind<IBaseController>(SYMBOLS.IBaseController).to(RootController)

export { container }
