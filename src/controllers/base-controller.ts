import type { Router } from 'express'

export interface IBaseController {
  router: Router
  path: string
  initRoutes(): void
}
