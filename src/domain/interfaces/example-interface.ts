/**
 * Example interface.
 */
import type { DisplayName } from '../values/display-name-value'

export interface IExample {
  name: DisplayName
  date_created?: Date | undefined
  date_deleted?: Date | undefined
}
