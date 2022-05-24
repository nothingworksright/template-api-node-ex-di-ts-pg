/**
 * Responder.
 *
 * Express.js response wrapper.
 *
 * Format based partly on omniti-labs/jsend {@link https://github.com/omniti-labs/jsend JSend}
 */

import type { Response } from 'express'
import type { httpStatusValueType } from '../data/constants'
import { log } from '../wrappers/log'
import { outcomes } from '../data/constants'
import { errClient } from '../wrappers/err'

export class Responder {
  // All went well, and (usually) some data was returned.
  public static success = (
    res: Response,
    statusCode: httpStatusValueType,
    data?: Record<string, unknown>,
  ): void => {
    log.trace(`Responder success ${statusCode}`)
    res.status(statusCode).json({ status: outcomes.SUCCESS, data: data })
  }

  // There was a problem with the data submitted, or some pre-condition of the
  // API call wasn't satisfied.
  public static fail = (
    res: Response,
    statusCode: httpStatusValueType,
    message?: string, // A meaningful, end-user-readable message, explaining what went wrong.
    errName?: string, // An internal error name if applicable.
    data?: Record<string, unknown>, // A generic container for any other information about the failure.
  ): void => {
    log.info(`Responder fail ${statusCode} ${errName} ${message}`)
    res.status(statusCode).json({
      status: outcomes.FAIL,
      message: message,
      code: errName,
      data: data,
    })
  }

  // An error occurred in processing the request, i.e. an exception was thrown.
  public static error = (
    res: Response,
    statusCode: httpStatusValueType,
    message?: string, // A meaningful, end-user-readable message, explaining what went wrong.
    errName?: string, // An internal error name if applicable.
  ): void => {
    log.error(`Responder error ${statusCode} ${errName} ${message}`)
    res.status(statusCode).json({
      status: outcomes.ERROR,
      message: errClient.LASTSTOP_500,
    })
  }
}
