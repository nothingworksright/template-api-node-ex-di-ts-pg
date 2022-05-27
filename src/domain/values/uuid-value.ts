/**
 * UUID value object.
 */
import { Err, errClient } from '../../wrappers/err'
import { ValueObject } from './base-value'
import { v4 as uuid, validate } from 'uuid'

export interface IUniqueId {
  value: string
}

export class UniqueId extends ValueObject<IUniqueId> {
  public get value(): string {
    return this.props.value
  }

  private constructor(props: IUniqueId) {
    super(props)
  }

  public static create(id?: string): UniqueId {
    if (!id) {
      id = uuid()
    }
    if (!validate(id)) {
      throw new Err(`UID_INVALID`, errClient.UID_INVALID)
    }
    return new UniqueId({ value: id })
  }
}
