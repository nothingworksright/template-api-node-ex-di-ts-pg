/**
 * Example mapper.
 */
import { Example } from '../models/example-model'
import type { ExampleDto } from '../dtos/example-dto'
import type { IExample } from '../interfaces/example-interface'
import { Err, errInternal } from '../../wrappers/err'
import { DisplayName } from '../values/display-name-value'
import { UniqueId } from '../values/uuid-value'

export class ExampleMap {
  public static dtoToDomain(exampleDto: ExampleDto): Example {
    if (!this.isExample(exampleDto)) {
      throw new Err(`DOMAIN_OBJECT`, `ExampleMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Example.create(
      {
        name: DisplayName.create(exampleDto.name),
        date_created: exampleDto.date_created ? new Date(exampleDto.date_created) : undefined,
        date_deleted: exampleDto.date_deleted ? new Date(exampleDto.date_deleted) : undefined,
      },
      UniqueId.create(exampleDto.id),
    )
  }

  public static dbToDomain(dbResult: ExampleDto, id: string): Example {
    if (!this.isExample(dbResult)) {
      throw new Err(`DOMAIN_OBJECT`, `ExampleMap: ${errInternal.DOMAIN_OBJECT}`)
    }
    return Example.create(
      {
        name: DisplayName.create(dbResult.name),
        date_created: dbResult.date_created ? new Date(dbResult.date_created) : undefined,
        date_deleted: dbResult.date_deleted ? new Date(dbResult.date_deleted) : undefined,
      },
      UniqueId.create(id),
    )
  }

  public static domainToDto(example: Example): ExampleDto {
    return {
      id: example.id.value,
      name: example.name.value,
      date_created: example.date_created?.toString(),
      date_deleted: example.date_deleted?.toString(),
    }
  }

  // Type-guard using a type-predicate method.
  public static isExample(raw: unknown): raw is IExample {
    if (!(raw as IExample).name) return false
    return true
  }
}
