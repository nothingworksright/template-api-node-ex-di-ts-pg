/**
 * Base value object abstract class.
 */

export abstract class ValueObject<T> {
  public readonly props: T

  public constructor(props: T) {
    this.props = Object.freeze(props)
  }
}
