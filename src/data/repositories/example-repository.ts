/**
 * Example repository.
 */
import { dbTables } from '../constants'
import type { IBaseRepo } from './base-repository'
import { BaseRepo } from './base-repository'
import { Example } from '../../domain/models/example-model'
import { ExampleMap } from '../../domain/maps/example-map'
import { Err, errClient } from '../../wrappers/err'
import type { DisplayName } from '../../domain/values/display-name-value'
import type { UniqueId } from '../../domain/values/uuid-value'
import type { PoolClient, QueryResult } from 'pg'

export interface IExampleRepo extends IBaseRepo {
  create(example: Example): Promise<Example>
  read(id: UniqueId): Promise<Example>
  update(id: UniqueId, name?: DisplayName): Promise<Example>
  delete(id: UniqueId): Promise<Example>
}

export class ExampleRepo extends BaseRepo implements IExampleRepo {
  constructor(client: PoolClient) {
    super(client, dbTables.EXAMPLES)
  }

  public create = async (example: Example): Promise<Example> => {
    // Verify no existing example by name.
    if ((await this._countByColumn('name', example.name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Save the example into the database.
    const query: string = `SELECT * FROM api.examples_create($1)`
    const result: QueryResult = await this.client.query(query, [example.name.value])
    // Return domain object from database query results.
    return ExampleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public read = async (id: UniqueId): Promise<Example> => {
    // Find the example by their unique id.
    const query: string = `SELECT * FROM api.examples_read($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`EXAMPLE_READ`, errClient.EXAMPLE_READ)
    }
    // Return domain object from database query results.
    return ExampleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public update = async (id: UniqueId, name?: DisplayName): Promise<Example> => {
    // Verify the incoming example name isn't being used by any example, except of
    // course if used by the example we are going to update now.
    if (name != undefined && (await this._countByColumnNotId(id.value, 'name', name.value)) > 0) {
      throw new Err(`NAME_USED`, errClient.NAME_USED)
    }
    // Update the example into the database.
    const query: string = `SELECT * FROM api.examples_update($1, $2)`
    const result: QueryResult = await this.client.query(query, [
      id.value,
      name != undefined ? name.value : null,
    ])
    if (result.rowCount !== 1) {
      throw new Err(`EXAMPLE_UPDATE`, errClient.EXAMPLE_UPDATE)
    }
    // Return domain object from database query results.
    return ExampleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  public delete = async (id: UniqueId): Promise<Example> => {
    // Delete the example by their unique id.
    const query: string = `SELECT * FROM api.examples_delete($1)`
    const result: QueryResult = await this.client.query(query, [id.value])
    if (result.rowCount !== 1) {
      throw new Err(`EXAMPLE_DELETE`, errClient.EXAMPLE_DELETE)
    }
    // Return domain object from database query results.
    return ExampleMap.dbToDomain(result.rows[0], result.rows[0].id)
  }

  // Function to return the count of example records that match a given column/value
  private _countByColumn = async (column: string, value: string): Promise<number> => {
    const query: string = `SELECT * FROM api.examples_count_by_column_value($1, $2)`
    const result: QueryResult = await this.client.query(query, [column, value])
    const count: number = result.rows[0].examples_count_by_column_value
    return count
  }

  // Function to return the count of records, other than the specified record id, that match a given column/value
  private _countByColumnNotId = async (
    id: string,
    column: string,
    value: string,
  ): Promise<number> => {
    const query: string = `SELECT * FROM api.examples_count_by_column_value_not_id($1, $2, $3)`
    const result: QueryResult = await this.client.query(query, [id, column, value])
    const count: number = result.rows[0].examples_count_by_id_column_value
    return count
  }
}
