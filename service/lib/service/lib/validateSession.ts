import { userSessionsFind } from '@task-2/persistence'
import { errorCodes } from 'fastify'
import jwt from 'jsonwebtoken'

export const validateSession = async (
  headers: { authorization?: string },
  tokenValidationRequired: boolean = false
): Promise<{ userId?: number }> => {
  if (!headers.authorization) {
    if (tokenValidationRequired) {
      throw new errorCodes.FST_ERR_VALIDATION('Authorization doesen\'t in headers')
    }

    return { userId: undefined }
  }

  const token = headers.authorization.slice(7)
  const valid = jwt.verify(token, process.env['JWT_SECRET']!)

  if (!valid) {
    if (tokenValidationRequired) {
      throw new errorCodes.FST_ERR_VALIDATION('Token is invalid')
    }

    return { userId: undefined }
  }

  const [userSession] = await userSessionsFind({ accessToken: token })

  if (!userSession) {
    if (tokenValidationRequired) {
      throw new errorCodes.FST_ERR_VALIDATION('Can\'t find user session')
    }

    return { userId: undefined }
  }

  const decodedToken = jwt.decode(token, { json: true })

  if (decodedToken == null) {
    throw new Error('Cant decode token')
  }

  return {
    userId: Number(decodedToken.sub)
  }
}
