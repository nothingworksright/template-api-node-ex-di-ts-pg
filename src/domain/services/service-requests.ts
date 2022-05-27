/**
 * Service request models.
 */
import { UniqueId } from '../values/uuid-value'
import { ExampleDto } from '../dtos/example-dto'

abstract class ServiceRequest<T> {
  protected _item: T

  protected authorizedId: UniqueId | undefined

  constructor(item: T, authorizedId?: UniqueId) {
    this._item = item
    this.authorizedId = authorizedId
  }
}

export class UuidRequest extends ServiceRequest<UniqueId> {
  public get id(): UniqueId {
    return this._item
  }

  private constructor(id: UniqueId, authorizedId?: UniqueId) {
    super(id, authorizedId)
  }

  // The id must be defined here. Otherwise UniqueId.create will just create a new
  // UUID, and we don't want a UuidRequest to happen if no UUID has been provided.
  public static create(id: string, authorizedId?: UniqueId): UuidRequest {
    return new UuidRequest(UniqueId.create(id), authorizedId)
  }
}

export class ExampleRequest extends ServiceRequest<ExampleDto> {
  public get example(): ExampleDto {
    return this._item
  }

  private constructor(example: ExampleDto, authorizedId?: UniqueId) {
    super(example, authorizedId)
  }

  public static create(example: ExampleDto, authorizedId?: UniqueId): ExampleRequest {
    return new ExampleRequest(example, authorizedId)
  }
}
