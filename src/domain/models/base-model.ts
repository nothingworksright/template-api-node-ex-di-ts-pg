/**
 * Base model abstract class.
 */
import { UniqueId } from '../values/uuid-value'

export abstract class Model<T> {
  protected readonly _id: UniqueId
  protected _props: T

  public constructor(props: T, id?: UniqueId) {
    this._id = id ? id : UniqueId.create()
    this._props = props
  }
}
