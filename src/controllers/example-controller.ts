/**
 * The example controller and routes.
 */
import { inject, injectable } from 'inversify'
import type { IBaseController } from './base-controller'
import { IExampleService } from '../services/example-service'
import { Router } from 'express'
import { SYMBOLS } from '../symbols'
import { fiveHundred } from '../middlewares/laststop'
import type { NextFunction, Request, Response } from 'express'
import { httpStatus } from '../data/constants'
import { Responder } from './responder'
import { outcomes } from '../data/constants'
import { Err, errClient, isErrClient } from '../wrappers/err'
import { ExampleRequest, UuidRequest } from '../domain/services/service-requests'

@injectable()
export class ExampleController implements IBaseController {
  private _exampleService: IExampleService
  router: Router = Router()
  path: string = `/v1/examples`

  public constructor(@inject(SYMBOLS.IExampleService) exampleService: IExampleService) {
    this._exampleService = exampleService
    this.initRoutes()
  }

  public initRoutes = (): void => {
    this.router.post(`/`, this.create)
    this.router.get(`/:id`, this.read)
    this.router.put(`/:id`, this.update)
    this.router.delete(`/:id`, this.delete)
    this.router.use(fiveHundred) // Error handling.
  }

  /**
   * @example
      curl --location --request POST 'http://127.0.0.1:1138/v1/examples' \
      --header 'Content-Type: application/json' \
      --data-raw '{
        "name": "foo"
      }'
   */
  private create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const svcReq = ExampleRequest.create({ ...req.body })
      const svcRes = await this._exampleService.create(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { example: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_CREATE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.params['id']) {
        throw new Err(`UID_INVALID`, errClient.UID_INVALID)
      }
      const svcReq = UuidRequest.create(req.params['id'])
      const svcRes = await this._exampleService.read(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { example: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_READ} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Put request path and body parameters must be present and must match.
      // https://dzone.com/articles/rest-api-path-vs-request-body-parameters
      if (req.params['id'] !== req.body.id) {
        throw new Err(`ID_MISMATCH`, errClient.ID_MISMATCH)
      }
      const svcReq = ExampleRequest.create({ ...req.body })
      const svcRes = await this._exampleService.update(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { example: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_UPDATE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }

  private delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.params['id']) {
        throw new Err(`UID_INVALID`, errClient.UID_INVALID)
      }
      const svcReq = UuidRequest.create(req.params['id'])
      const svcRes = await this._exampleService.delete(svcReq)
      const code = svcRes.statusCode
      switch (svcRes.outcome) {
        case outcomes.SUCCESS:
          Responder.success(res, code, { example: svcRes.item })
          break
        case outcomes.FAIL:
          Responder.fail(res, code, svcRes.err?.message, svcRes.err?.name)
          break
        default:
          Responder.error(res, code, svcRes.err?.message, svcRes.err?.name)
          break
      }
    } catch (e) {
      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)
      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_DELETE} ${err.message}`
        Responder.fail(res, httpStatus.BAD_REQUEST, err.message, err.name)
      } else {
        next(err)
      }
    }
  }
}
