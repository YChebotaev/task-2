import { createService } from './lib/service'
import { logger } from './lib/logger'

createService({ logger })
  .then(service => {
    return service.listen({
      port: Number(process.env['PORT'] ?? 3000),
      host: process.env['HOST'] ?? '0.0.0.0'
    })
  })
  .catch(e => logger.fatal(e))
