/**
 * The root controller and routes.
 */
import { injectable } from 'inversify'
import type { IBaseController } from './base-controller'
import { Router } from 'express'
import { fiveHundred } from '../middlewares/laststop'
import type { NextFunction, Request, Response } from 'express'
import { httpStatus } from '../data/constants'
import { Responder } from './responder'

@injectable()
export class RootController implements IBaseController {
  router: Router = Router()
  path: string = `/`

  public constructor() {
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.get(`/`, this.curtsy)
    this.router.use(fiveHundred) // Error handling.
  }

  private curtsy = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const code = httpStatus.OK
      const welcomeMsg = `Welcome to the API server. This is the root route.`
      Responder.success(res, code, { message: welcomeMsg })
    } catch (err) {
      next(err)
    }
  }
}
