/**
 * Last stop middleware for 404 and 500 error handling.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express'
import { log } from '../wrappers/log'
import { errClient } from '../wrappers/err'
import { Responder } from '../controllers/responder'
import { httpStatus } from '../data/constants'

/**
 * Four, oh four! Not found, my dude.
 */
export const fourOhFour = (req: Request, _res: Response, _next: NextFunction): void => {
  log.info(`${errClient.LASTSTOP_404} ${req.method} ${req.path}`)
  Responder.fail(_res, httpStatus.NOT_FOUND, errClient.LASTSTOP_404, `LASTSTOP_404`)
  // I do not pass the error along to next(err) here on purpose.
  // We already handled the 404 Not Found as much as we want to.
  // We already sent headers to the client, so even if we were to pass the error
  // to our custom error handler, it would just pass it to the express built-in
  // error handler, and we don't want to do that.
}

/**
 * Five hundred! Custom error handling middleware.
 */
// Because this API is built with separate express.Router router instances, this
// error handling middleware must be used at the end of every controller/router.
export const fiveHundred = (err: Error, _req: Request, res: Response, next: NextFunction): void => {
  log.error(`${errClient.LASTSTOP_500} ${err.name} ${err.message}`)
  // Cannot set headers after they are sent to the client!
  // https://expressjs.com/en/guide/error-handling.html
  // If you call next() with an error after you have started writing the
  // response (for example, if you encounter an error while streaming the
  // response to the client) the Express default error handler closes the
  // connection and fails the request. So when you add a custom error handler,
  // you must delegate to the default Express error handler, when the headers
  // have already been sent to the client:
  if (res.headersSent) {
    return next(err)
  }
  // Ok, now we can delegate to our custom error handling.
  // For security, do not provide any internal error details.
  // Be vague here on purpose.
  Responder.error(res, httpStatus.INTERNAL_ERROR, errClient.LASTSTOP_500, `LASTSTOP_500`)
}
