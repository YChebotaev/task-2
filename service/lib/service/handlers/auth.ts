import { randomBytes, createHash } from 'node:crypto'
import { errorCodes } from 'fastify'
import { addDays, subHours } from 'date-fns'
import jwt from 'jsonwebtoken'
import { validateUsername } from '@task-2/common/validateUsername'
import {
  userCreate,
  userSessionCreate,
  userSessionUpdate,
  usersFind,
  userStreamSubscriptionCreate,
  streamGetBySlug,
  streamCreate,
  type User,
  userProfileCreate
} from '@task-2/persistence'

const createSession = async (userId: number) => {
  const userSessionId = await userSessionCreate({ userId })

  const expiresIn = Math.ceil(addDays(new Date(), 1).getTime() / 1000)

  const accessToken = jwt.sign({}, process.env['JWT_SECRET']!, {
    subject: String(userId),
    expiresIn,
    jwtid: String(userSessionId)
  })

  const refreshToken = jwt.sign({}, process.env['JWT_SECRET']!, {
    subject: String(userId),
    expiresIn: Math.ceil(addDays(expiresIn * 1000, 7).getTime() / 1000),
    notBefore: Math.ceil(subHours(expiresIn * 1000, 1).getDate() / 1000)
  })

  await userSessionUpdate(userSessionId, { accessToken, refreshToken })

  return {
    accessToken,
    refreshToken
  }
}

const findUserByIdentity = async (identity: string) => {
  let user: User

  do {
    ;[user] = await usersFind({ email: identity })

    if (user != null) break

      ;[user] = await usersFind({ username: identity })

    if (user != null) break
  } while (false)

  if (user == null) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Пользователь не найден')
  }

  return user
}

const validateUserCreation = async ({ username, email, password, passwordConfirm }: {
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
}) => {
  const usernameValid = validateUsername(username)

  if (!usernameValid) {
    throw new errorCodes.FST_ERR_VALIDATION('Имя пользователя не валидно')
  }

  if (!email.includes('@')) {
    throw new errorCodes.FST_ERR_VALIDATION('Емейл не валиден')
  }

  if (password !== passwordConfirm) {
    throw new errorCodes.FST_ERR_VALIDATION('Подтверждение пароля не совпадает')
  }

  {
    const [user] = await usersFind({ username })

    if (user != null) {
      throw new errorCodes.FST_ERR_VALIDATION('Пользователь с таким именем уже существует')
    }
  }

  {
    const [user] = await usersFind({ email })

    if (user != null) {
      throw new errorCodes.FST_ERR_VALIDATION('Пользователь с таким емейлом ужеы существует')
    }
  }
}

const hashPassword = (
  password: string,
  passwordSalt = randomBytes(20).toString('hex')
) => {
  const passwordPepper = process.env['PASSWORD_PEPPER']!
  const passwordHash = createHash('sha256')
    .update(passwordSalt)
    .update(passwordPepper)
    .update(password)
    .digest('hex')

  return [passwordHash, passwordSalt]
}

export const signin = async (identity: string, password: string) => {
  const user = await findUserByIdentity(identity)
  const [passwordHash] = hashPassword(password, user.passwordSalt)

  if (user.passwordHash !== passwordHash) {
    throw new errorCodes.FST_ERR_NOT_FOUND('Пользователь не найден')
  }

  return createSession(user.id)
}

const createUserStream = async (userId: number, username: string) => {
  const streamId = await streamCreate({ title: username, slug: username })

  await userStreamSubscriptionCreate({ userId, streamId, type: 'user' })
}

const subscribeToEverythingStream = async (userId: number) => {
  const everythingStream = await streamGetBySlug('everything')

  if (!everythingStream) {
    return
  }

  await userStreamSubscriptionCreate({
    userId,
    streamId: everythingStream.id,
    type: 'stream'
  })
}

export const signup = async (
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
) => {
  await validateUserCreation({
    username,
    email,
    password,
    passwordConfirm
  })

  const [passwordHash, passwordSalt] = hashPassword(password)

  const userId = await userCreate({
    username,
    email,
    passwordHash,
    passwordSalt
  })

  await userProfileCreate({ userId })
  await createUserStream(userId, username)
  await subscribeToEverythingStream(userId)

  return createSession(userId)
}

export const signout = async () => { }
