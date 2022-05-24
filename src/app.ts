import { log } from './wrappers/log'
import type { Application, RequestHandler } from 'express'
import type { IBaseController } from './controllers/base-controller'
import express from 'express'
import cors from 'cors'
import { fourOhFour, fiveHundred } from './middlewares/laststop'

export const listen = async (
  middlewares: Array<RequestHandler>,
  controllers: Array<IBaseController>,
  port: number,
): Promise<void> => {
  log.trace(`app.ts listen()`)

  // Instatiate our express.js web application with settings.
  const app: Application = express().set('json spaces', 2)

  // Use the express.js middleware to enable cross origin resource sharing.
  app.use(cors())

  // Use our middlewares. Middleware can be declared in an array.
  // @see {@link https://expressjs.com/en/guide/using-middleware.html Application-level middleware}
  app.use(middlewares)

  // Each controller will have a separate express.Router router instance. Each
  // of those is a complete middleware and routing system (mini-app). For more
  // info about this style of express.js router setup, see the following link.
  // @see {@link https://expressjs.com/en/guide/routing.html express.Router}
  controllers.forEach((controller: IBaseController) => {
    app.use(controller.path, controller.router)
  })

  // If none of the registered controllers were hit, reply 404 Not Found.
  // This is really our final application-level middleware.
  app.use(fourOhFour)

  // This error handling middleware doesn't really get used here much if ever.
  // Each controller uses it's own express.Router, which has its own router
  // stack, so every controller implements the error handling middleware at the
  // end of their own router stack. This is here just in case some error happens
  // that isn't inside of one of the controller's router stacks.
  app.use(fiveHundred)

  // Finally, start listening on the specified port.
  app.listen(port, () => {
    log.info(`Express.js is listening on port ${port}`)
  })
}
