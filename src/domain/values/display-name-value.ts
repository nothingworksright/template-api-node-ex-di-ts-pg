/**
 * Display-name value object.
 */
import { Err, errClient } from '../../wrappers/err'
import { ValueObject } from './base-value'

export interface IDisplayName {
  value: string
}

export class DisplayName extends ValueObject<IDisplayName> {
  public get value(): string {
    return this.props.value
  }

  private constructor(props: IDisplayName) {
    super(props)
  }

  public static create(displayName: string): DisplayName {
    displayName = displayName.trim()
    if (!displayName.match('^[A-Za-z0-9]+$') || displayName.length < 2 || displayName.length > 50) {
      throw new Err(`NAME_INVALID`, errClient.NAME_INVALID)
    }
    return new DisplayName({ value: displayName })
  }
}
