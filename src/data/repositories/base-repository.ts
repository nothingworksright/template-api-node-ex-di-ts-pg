/**
 * Base class for all repositories to extend from.
 */
import type { dbTablesValueType } from '../constants'
import type { PoolClient } from 'pg'

export interface IBaseRepo {
  client: PoolClient
}

export abstract class BaseRepo implements IBaseRepo {
  public client: PoolClient
  protected _table: dbTablesValueType

  constructor(client: PoolClient, table: dbTablesValueType) {
    this.client = client
    this._table = table
  }
}
