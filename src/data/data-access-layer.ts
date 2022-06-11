/**
 * DAL (Data access layer).
 */
import { log } from '../wrappers/log'
import { injectable } from 'inversify'
import type { PoolClient, QueryResult } from 'pg'
import pg from 'pg'
import 'reflect-metadata'

export interface IDataAccessLayer {
  query(text: string, params: Array<string>): Promise<QueryResult>
  getClient(): Promise<PoolClient>
}

/**
 * A `node-postgres` wrapper.
 * @see {@link https://node-postgres.com/ node-postgres}
 * @see {@link https://node-postgres.com/guides/project-structure Suggested Project Structure Using async/await}
 */
@injectable()
export class DataAccessLayer implements IDataAccessLayer {
  private _pool = new pg.Pool({
    user: process.env['API_DB_USER'] as string,
    host: process.env['API_DB_HOST'] as string,
    database: process.env['API_DB_DATABASE'] as string,
    password: process.env['API_DB_PASSWORD'] as string,
    port: parseInt(process.env['API_DB_PORT'] as string, 10),
  })

  /**
   * Run a single query using pool.query and get the query results back.
   *
   * @memberof DataAccessLayer
   * @returns The QueryResult object.
   */
  public query = async (text: string, params: Array<string>): Promise<QueryResult> => {
    const start: number = Date.now()
    const result: QueryResult<never> = await this._pool.query(text, params)
    const duration: number = Date.now() - start
    log.info(`Executed query. ${text}, ${duration}, ${result.rowCount}`)
    return result
  }

  /**
   * Check out a client using pool.connect. Will log a warning when the client
   * remains checked out for longer than five seconds without releasing.
   *
   * @memberof DataAccessLayer
   * @returns The PoolClient object.
   */
  public getClient = async (): Promise<PoolClient> => {
    const client: PoolClient = await this._pool.connect()
    const release = client.release // Make a backup client.release.
    const timeout: NodeJS.Timeout = setTimeout(() => {
      log.warn(`A pg client has been out for more than 10 seconds!`)
    }, 10000)
    client.release = (): void => {
      // Override client.release.
      clearTimeout(timeout)
      client.release = release // Reset client.release.
      return release.apply(client)
    }
    return client
  }
}
