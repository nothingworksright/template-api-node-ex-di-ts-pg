/**
 * Inversion-of-control configuration.
 * Dependency injection container.
 */

import { Container } from 'inversify'
import { SYMBOLS } from './symbols'
import type { IApi } from './api'
import { Api } from './api'
import type { IBaseController } from './controllers/base-controller'
import { ExampleController } from './controllers/example-controller'
import { RootController } from './controllers/root-controller'
import { DataAccessLayer, IDataAccessLayer } from './data/data-access-layer'
import { IUnitOfWork, UnitOfWork } from './data/repositories/unit-of-work'
import { ExampleService, IExampleService } from './services/example-service'

const container = new Container()

// Add the Api class to the container.
container.bind<IApi>(SYMBOLS.IApi).to(Api)

// Add the controllers to the container.
container.bind<IBaseController>(SYMBOLS.IBaseController).to(ExampleController)
container.bind<IBaseController>(SYMBOLS.IBaseController).to(RootController)

// Add data handlers to the container.
container.bind<IDataAccessLayer>(SYMBOLS.IDataAccessLayer).to(DataAccessLayer)
container.bind<IUnitOfWork>(SYMBOLS.IUnitOfWork).to(UnitOfWork)

// Add services to the container.
container.bind<IExampleService>(SYMBOLS.IExampleService).to(ExampleService)

export { container }
