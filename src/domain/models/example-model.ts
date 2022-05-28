/**
 * Example model.
 */
import { Model } from './base-model'
import { IExample } from '../interfaces/example-interface'
import { DisplayName } from '../values/display-name-value'
import { UniqueId } from '../values/uuid-value'

export class Example extends Model<IExample> {
  public get id(): UniqueId {
    return this._id
  }

  public get name(): DisplayName {
    return this._props.name
  }

  public get date_created(): Date | undefined {
    return this._props.date_created
  }

  public get date_deleted(): Date | undefined {
    return this._props.date_deleted
  }

  private constructor(props: IExample, id?: UniqueId) {
    super(props, id)
  }

  public static create(props: IExample, id?: UniqueId): Example {
    return new Example(props, id)
  }
}
