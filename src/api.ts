import { injectable, multiInject } from 'inversify'
import 'reflect-metadata'
import type { IBaseController } from './controllers/base-controller'
import { SYMBOLS } from './symbols'
import { log } from './wrappers/log'
import type { RequestHandler } from 'express'
import Helmet from 'helmet'
import { json } from 'express'
import { callHistory } from './middlewares/callhistory'
import { listen } from './app'
import { Err, errEnv } from './wrappers/err'

export interface IApi {
  start(): void
}

@injectable()
export class Api implements IApi {
  private _controllers: IBaseController[]

  public constructor(@multiInject(SYMBOLS.IBaseController) controllers: IBaseController[]) {
    this._controllers = controllers
  }

  public start = async (): Promise<void> => {
    try {
      log.trace(`api.ts start()`)
      this._envVarCheck()
      const middlewares: Array<RequestHandler> = [
        Helmet({
          contentSecurityPolicy: {
            useDefaults: true,
            directives: { defaultSrc: ["'self'"] },
          },
          referrerPolicy: { policy: 'same-origin' },
        }),
        json(),
        callHistory,
      ]
      const controllers: Array<IBaseController> = this._controllers
      const port: number = parseInt(process.env['API_PORT'] as string, 10)
      await listen(middlewares, controllers, port)
    } catch (e) {
      log.fatal((e as Error).message)
      process.exit(1)
    }
  }

  private _envVarCheck = (): void => {
    log.trace(`api.ts envVarCheck()`)
    if (!process.env['NODE_ENV']) {
      log.warn(`NODE_ENV is not set. Assuming environment is not production.`)
    }
    if (!process.env['API_PORT']) throw new Err(`ENV_API_PORT`, errEnv.ENV_API_PORT)

    if (!process.env['API_DB_USER']) throw new Err(`ENV_API_DB_USER`, errEnv.ENV_API_DB_USER)
    if (!process.env['API_DB_HOST']) throw new Err(`ENV_API_DB_HOST`, errEnv.ENV_API_DB_HOST)
    if (!process.env['API_DB_DATABASE'])
      throw new Err(`ENV_API_DB_DATABASE`, errEnv.ENV_API_DB_DATABASE)
    if (!process.env['API_DB_PASSWORD'])
      throw new Err(`ENV_API_DB_PASSWORD`, errEnv.ENV_API_DB_PASSWORD)
    if (!process.env['API_DB_PORT']) throw new Err(`ENV_API_DB_PORT`, errEnv.ENV_API_DB_PORT)

    if (!process.env['API_DB_OWNER']) {
      log.warn(`DB_OWNER is not set. Database migrations are disabled.`)
    }
    if (!process.env['API_DB_URL']) {
      log.warn(`DB_URL is not set. Database migrations are disabled.`)
    }
    if (!process.env['API_DB_MIGRATIONS']) {
      log.warn(`DB_MIGRATIONS is not set. Database migrations are disabled.`)
    }

    if (!process.env['API_LOG_TARGETS']) {
      log.warn(`API_LOG_TARGETS is not set. Logging is disabled.`)
    }
  }
}
