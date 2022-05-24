import { createLogger } from 'bs-logger'

export const log = createLogger({
  targets: process.env['API_LOG_TARGETS'] as string,
})
