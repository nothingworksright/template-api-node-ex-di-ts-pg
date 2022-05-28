/**
 * Constants.
 *
 * Based on an approach in an article titled "How to Share Constants in
 * Typescript Project" by Sunny Sun. 7/25/2021.
 * @see {@link https://medium.com/codex/how-to-share-constants-in-typescript-project-8f76a2e40352}
 */

/**
 * Database table names.
 */
export const dbTables = {
  EXAMPLES: `api.examples`,
} as const
type dbTablesType = typeof dbTables
export type dbTablesKeyType = keyof dbTablesType
export type dbTablesValueType = dbTablesType[keyof dbTablesType]

/**
 * HTTP response status codes.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status}
 */
export const httpStatus = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const
type httpStatusType = typeof httpStatus
export type httpStatusKeyType = keyof httpStatusType
export type httpStatusValueType = httpStatusType[keyof httpStatusType]

/**
 * Outcomes of service layer requests.
 */
export const outcomes = {
  SUCCESS: `success`,
  FAIL: `fail`,
  ERROR: `error`,
} as const
type outcomeType = typeof outcomes
export type outcomeKeyType = keyof outcomeType
export type outcomeValueType = outcomeType[keyof outcomeType]
