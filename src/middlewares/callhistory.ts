import type { NextFunction, Request, Response } from 'express'
import { log } from '../wrappers/log'

export const callHistory = (req: Request, _res: Response, next: NextFunction): void => {
  log.info(`Request: ${req.method} ${req.path}`)
  next()
}
