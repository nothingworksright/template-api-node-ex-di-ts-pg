/**
 * Example service.
 */
import { injectable } from 'inversify'
import { SYMBOLS } from '../symbols'
import { ExampleRequest, UuidRequest } from '../domain/services/service-requests'
import { ExampleResponse } from '../domain/services/service-responses'
import { container } from '../ioc.config'
import type { IUnitOfWork } from '../data/repositories/unit-of-work'
import { Example } from '../domain/models/example-model'
import { ExampleMap } from '../domain/maps/example-map'
import { Err, errClient, isErrClient } from '../wrappers/err'
import { DisplayName } from '../domain/values/display-name-value'
import { UniqueId } from '../domain/values/uuid-value'

export interface IExampleService {
  create(req: ExampleRequest): Promise<ExampleResponse>
  read(req: UuidRequest): Promise<ExampleResponse>
  update(req: ExampleRequest): Promise<ExampleResponse>
  delete(req: UuidRequest): Promise<ExampleResponse>
}

@injectable()
export class ExampleService implements IExampleService {
  // public constructor() {}

  public async create(req: ExampleRequest): Promise<ExampleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Create the entity in persistence.
      const example: Example = await uow.examples.create(ExampleMap.dtoToDomain(req.example))

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return ExampleResponse.success(ExampleMap.domainToDto(example))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_CREATE} ${err.message}`
        return ExampleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return ExampleResponse.error(err)
    }
  }

  public async read(req: UuidRequest): Promise<ExampleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Read the entity from persistence.
      const example: Example = await uow.examples.read(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return ExampleResponse.success(ExampleMap.domainToDto(example))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_READ} ${err.message}`
        return ExampleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return ExampleResponse.error(err)
    }
  }

  public async update(req: ExampleRequest): Promise<ExampleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Verify the request DTO has an id.
      if (!req.example.id) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} id`)
      }
      // Verify the request DTO has a name.
      // The name is optional. Hopefully they're updating something though.
      if (!req.example.name) {
        throw new Err(`MISSING_REQ`, `${errClient.MISSING_REQ} at least name`)
      }

      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      const id = UniqueId.create(req.example.id)
      const name = req.example.name != undefined ? DisplayName.create(req.example.name) : undefined

      // Update the entity in persistence.
      const example: Example = await uow.examples.update(id, name)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return ExampleResponse.success(ExampleMap.domainToDto(example))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_UPDATE} ${err.message}`
        return ExampleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return ExampleResponse.error(err)
    }
  }

  public async delete(req: UuidRequest): Promise<ExampleResponse> {
    // Get a new instance of uow from the DI container.
    const uow = container.get<IUnitOfWork>(SYMBOLS.IUnitOfWork)

    try {
      // Connect to the database and begin a transaction.
      await uow.connect()
      await uow.begin()

      // Delete the entity from persistence (soft delete).
      const example: Example = await uow.examples.delete(req.id)

      // Commit the database transaction (also releases the connection.)
      await uow.commit()

      return ExampleResponse.success(ExampleMap.domainToDto(example))
    } catch (e) {
      // Attempt a rollback. If no database client exists, nothing will happen.
      await uow.rollback()

      // The caught e could be anything. Turn it into an Err.
      const err = Err.toErr(e)

      // If the error message can be client facing, return BAD_REQUEST.
      if (isErrClient(err.name)) {
        err.message = `${errClient.EXAMPLE_DELETE} ${err.message}`
        return ExampleResponse.fail(err)
      }

      // Do not leak internal error details, return INTERNAL_ERROR.
      return ExampleResponse.error(err)
    }
  }
}
