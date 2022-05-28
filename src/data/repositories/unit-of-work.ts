/**
 * Unit of work.
 * Coordinate the work of multiple repositories.
 */
import { SYMBOLS } from '../../symbols'
import type { IDataAccessLayer } from '../data-access-layer'
import type { IExampleRepo } from './example-repository'
import { ExampleRepo } from './example-repository'
import { Err, errInternal } from '../../wrappers/err'
import { inject, injectable } from 'inversify'
import type { PoolClient } from 'pg'
import 'reflect-metadata'

export interface IUnitOfWork {
  connect(): Promise<void>
  begin(): Promise<void>
  commit(): Promise<void>
  rollback(): Promise<void>
  examples: IExampleRepo
}

@injectable()
export class UnitOfWork implements IUnitOfWork {
  private _dal: IDataAccessLayer
  private _client: PoolClient | undefined
  private _exampleRepo: IExampleRepo | undefined

  public constructor(@inject(SYMBOLS.IDataAccessLayer) dataAccessLayer: IDataAccessLayer) {
    this._dal = dataAccessLayer
  }

  public connect = async (): Promise<void> => {
    this._client = await this._dal.getClient()
  }

  public begin = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    await this._client.query('BEGIN')
  }

  public commit = async (): Promise<void> => {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    await this._client.query('COMMIT')
    this._client.release()
  }

  public rollback = async (): Promise<void> => {
    // If there is no client, there is nothing to rollback or release.
    if (!this._client) {
      return
    }
    await this._client.query('ROLLBACK')
    this._client.release()
  }

  public get examples(): IExampleRepo {
    if (!this._client) throw new Err('UOW_CLIENT', errInternal.UOW_CLIENT)
    if (!this._exampleRepo) {
      this._exampleRepo = new ExampleRepo(this._client)
    }
    return this._exampleRepo
  }
}
