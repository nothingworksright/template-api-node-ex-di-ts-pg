/**
 * The application entry point and composition root.
 */

import { container } from './ioc.config'
import { SYMBOLS } from './symbols'
import { IApi } from './api'

// Composition root: https://blog.ploeh.dk/2011/07/28/CompositionRoot/
const api = container.get<IApi>(SYMBOLS.IApi)

api.start()
