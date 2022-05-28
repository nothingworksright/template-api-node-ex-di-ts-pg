/**
 * Service response models.
 */
import { httpStatus, httpStatusValueType, outcomes, outcomeValueType } from '../../data/constants'
import { Err } from '../../wrappers/err'
import { ExampleDto } from '../dtos/example-dto'

abstract class ServiceResponse<T> {
  // What was the outcome?
  // Did we have succcess, fail, or error?
  protected _outcome: outcomeValueType

  // HTTP status code.
  // @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
  // Must be one of the defined constants of type httpStatusValueType.
  protected _statusCode: httpStatusValueType

  // Item requested.
  // If some item was requested, respond with the item here.
  // Examples: a user object, or an authentication token.
  protected _item?: T | undefined

  // Err object.
  // An error happened during the request.
  // This could be from an outcome of FAIL or ERROR.
  protected _err?: Err | undefined

  public get outcome(): outcomeValueType {
    return this._outcome
  }

  public get statusCode(): httpStatusValueType {
    return this._statusCode
  }

  public get item(): T | undefined {
    return this._item
  }

  public get err(): Err | undefined {
    return this._err
  }

  // Outcome is assumed an error unless explicitly set otherwise.
  public constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: T,
    err?: Err,
  ) {
    this._outcome = outcome
    this._err = err
    this._item = item
    this._statusCode = statusCode
  }
}

export class ExampleResponse extends ServiceResponse<ExampleDto> {
  private constructor(
    outcome: outcomeValueType = outcomes.ERROR,
    statusCode: httpStatusValueType,
    item?: ExampleDto,
    err?: Err,
  ) {
    super(outcome, statusCode, item, err)
  }

  public static success(item: ExampleDto): ExampleResponse {
    return new ExampleResponse(outcomes.SUCCESS, httpStatus.OK, item)
  }

  public static fail(err: Err): ExampleResponse {
    return new ExampleResponse(outcomes.FAIL, httpStatus.BAD_REQUEST, undefined, err)
  }

  public static error(err: Err): ExampleResponse {
    return new ExampleResponse(outcomes.ERROR, httpStatus.INTERNAL_ERROR, undefined, err)
  }
}
