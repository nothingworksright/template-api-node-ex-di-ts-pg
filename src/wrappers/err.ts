/**
 * Extended class based on the Error class.
 * Set a name and message all at once. Remarkable!
 *
 * Some of the helpers below were created based on ...
 * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 *
 * Instantiate error objects with a custom name in one line, with type safety
 * enforced for the name and message. Error messages must be defined in the
 * global constants before they may be used.
 */
export class Err extends Error {
  public constructor(
    name: errEnvKeyType | errClientKeyType | errInternalKeyType,
    message: errEnvValueType | errClientValueType | errInternalValueType,
  ) {
    super(message)
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype)
  }

  // Type-guard using a type-predicate method.
  // Do our best to determine if the unknown is an Err.
  public static isErr(unknown: unknown): unknown is Err {
    return (
      typeof unknown === 'object' &&
      unknown !== null &&
      'name' in unknown &&
      typeof (unknown as Record<string, unknown>)['name'] === 'string' &&
      'message' in unknown &&
      typeof (unknown as Record<string, unknown>)['message'] === 'string'
    )
  }

  // Convert an object into an Err.
  // Used in the catch of a try/catch. The caught object might be anything.
  // Here we take that object and return it as an Err.
  public static toErr(unknown: unknown): Err {
    if (Err.isErr(unknown)) {
      return unknown
    } else {
      try {
        return new Err(`UNKNOWN`, JSON.stringify(unknown))
      } catch {
        // Fallback in case there's an error stringifying the unknown object
        // like with circular references for example.
        return new Err(`UNKNOWN`, String(unknown))
      }
    }
  }

  public static getErrName(unknown: unknown): string {
    return Err.toErr(unknown).name
  }

  public static getErrMessage(unknown: unknown): string {
    return Err.toErr(unknown).message
  }
}

//#region Error message constants.

// Environment variable error messages.
export const errEnv = {
  ENV_API_PORT: `Environment variable API_PORT is not set. This is required for Expressjs to listen.`,
  ENV_API_DB_USER: `Environment variable API_DB_USER is not set. This is required for database communication.`,
  ENV_API_DB_HOST: `Environment variable API_DB_HOST is not set. This is required for database communication.`,
  ENV_API_DB_DATABASE: `Environment variable API_DB_DATABASE is not set. This is required for database communication.`,
  ENV_API_DB_PASSWORD: `Environment variable API_DB_PASSWORD is not set. This is required for database communication.`,
  ENV_API_DB_PORT: `Environment variable API_DB_PORT is not set. This is required for database communication.`,
}
type errEnvType = typeof errEnv
export type errEnvKeyType = keyof errEnvType
export type errEnvValueType = errEnvType[keyof errEnvType]

// Client facing error messages.
export const errClient = {
  LASTSTOP_404: `The endpoint you are looking for can't be found.`,
  LASTSTOP_500: `Something went wrong.`,
  ID_MISMATCH: `The path UUID does not match the request body UUID or token subject UUID.`,
  UID_INVALID: `The supplied UUID is not a valid v4 UUID.`,
  EXAMPLE_CREATE: `The example couldn't be created.`,
  EXAMPLE_READ: `The example couldn't be found.`,
  EXAMPLE_UPDATE: `The example couldn't be updated.`,
  EXAMPLE_DELETE: `The example couldn't be deleted.`,
}
type errClientType = typeof errClient
export type errClientKeyType = keyof errClientType
export type errClientValueType = errClientType[keyof errClientType]
export const isErrClient = (key: string): key is errClientKeyType => {
  return Object.keys(errClient).includes(key)
}

// Internal-only error messages.
export const errInternal = {
  UNKNOWN: `Unknown error.`,
}
type errInternalType = typeof errInternal
export type errInternalKeyType = keyof errInternalType
export type errInternalValueType = errInternalType[keyof errInternalType]

//#endregion
