import { promisify } from 'node:util'
import { pipeline } from 'node:stream'
import { createWriteStream } from 'node:fs'
import path from 'node:path'
import { Server as SocketIOServer } from 'socket.io'
import fastify, { errorCodes } from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { type Logger } from 'pino'
import * as handlers from './handlers'
import { parseNumber } from './lib/parseNumber'
import { validateSession } from './lib/validateSession'
import { uploadCreate } from '@task-2/persistence'

const pump = promisify(pipeline)

export const createService = async ({ logger }: { logger: Logger }) => {
  const server = fastify({ logger })

  const io = new SocketIOServer(server.server, {
    serveClient: false,
    cors: { origin: '*' }
  })

  io.on('connection', async (socket) => {
    try {
      const { token } = socket.handshake.auth as { token: string }

      if (!token) {
        throw new Error('Token not provided')
      }

      const { userId } = await validateSession({ authorization: `Bearer ${token}` }, true)

      await socket.join(`user:${userId!}`)

      socket.on('disconnect', async () => {
        try {
          await socket.leave(`user:${userId!}`)
        } catch (e) {
          logger.error(e)
        }
      })
    } catch (e) {
      console.error(e)

      logger.error(e)

      socket.disconnect(true)
    }
  })

  await server.register(fastifyMultipart)
  await server.register(fastifyCors, { origin: true })
  await server.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Task-2 service",
        description: "",
        version: '0.1.0'
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })

  server.post<{
    Body: {
      identity: string
      password: string
    }
  }>('/auth/signin', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['identity', 'password'],
        properties: {
          identity: { type: 'string', minLength: 1, maxLength: 255 },
          password: { type: 'string', minLength: 1 }
        }
      }
    }
  }, async ({ body: { identity, password } }) => {
    return handlers.auth.signin(identity, password)
  })

  server.post<{
    Body: {
      username: string
      email: string
      password: string
      passwordConfirm: string
    }
  }>('/auth/signup', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['username', 'email', 'password', 'passwordConfirm'],
        properties: {
          username: { type: 'string', minLength: 1, maxLength: 255 },
          email: { type: 'string', minLength: 1, maxLength: 255 },
          password: { type: 'string', minLength: 1, maxLength: 255 },
          passwordConfirm: { type: 'string', minLength: 1, maxLength: 255 },
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' }
          }
        }
      }
    }
  }, async ({ body: { username, email, password, passwordConfirm } }) => {
    return handlers.auth.signup(username, email, password, passwordConfirm)
  })

  server.get<{
    Querystring: {
      username: string
    }
  }>('/users', {
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        required: ['username'],
        properties: {
          username: { type: 'string', minLength: 1, maxLength: 255 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            avatarSrc: { type: 'string' },
            coverSrc: { type: 'string' },
            subscribed: { type: 'boolean' },
          }
        }
      }
    }
  }, async ({ headers, query: { username } }) => {
    const { userId } = await validateSession(headers)

    return handlers.users.getUserByUsername(userId, username)
  })

  server.get<{
    Params: {
      userId: string
    }
  }>('/users/:userId', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            avatarSrc: { type: 'string' },
            coverSrc: { type: 'string' },
            subscribed: { type: 'boolean' },
          }
        }
      }
    }
  }, async ({ headers, params: { userId: userIdStr } }) => {
    const { userId: myId } = await validateSession(headers)
    const userId = parseNumber(userIdStr)

    return handlers.users.getUserById(myId, userId)
  })

  server.get<{
    Params: {
      userId: string
    }
  }>('/users/:userId/profile', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            bio: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateOfBirth: { type: 'number' },
            country: { type: 'string' },
            city: { type: 'string' },
          }
        }
      }
    }
  }, async ({ params: { userId: userIdStr } }) => {
    const userId = parseNumber(userIdStr)

    return handlers.profile.getProfileOfUser(userId)
  })

  server.post<{
    Params: {
      userId: string
    }
  }>('/users/:userId/subscribe', async ({ headers, params: { userId: userIdStr } }) => {
    const { userId: myId } = await validateSession(headers, true)
    const userId = parseNumber(userIdStr)

    await handlers.users.subscribeToUser(myId!, userId)
  })

  server.post<{
    Params: {
      userId: string
    }
  }>('/users/:userId/unsubscribe', async ({ headers, params: { userId: userIdStr } }) => {
    const { userId: myId } = await validateSession(headers, true)
    const userId = parseNumber(userIdStr)

    await handlers.users.unsubscribeFromUser(myId!, userId)
  })

  server.get<{
    Params: {
      userId: string
    }
  }>('/users/:userId/chat', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            initiator: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                avatarSrc: { type: 'string' },
                coverSrc: { type: 'string' },
                subscribed: { type: 'boolean' },
              }
            },
            recepient: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                avatarSrc: { type: 'string' },
                coverSrc: { type: 'string' },
                subscribed: { type: 'boolean' },
              }
            },
            unreadCount: { type: 'number' },
            createdAt: { type: 'number' },
            updatedAt: { type: 'number' }
          }
        }
      }
    }
  }, async ({ headers, params: { userId: userIdStr } }) => {
    const { userId: myId } = await validateSession(headers, true)
    const userId = parseNumber(userIdStr)

    return handlers.chats.getChatForUser(myId!, userId)
  })

  server.get('/users/me', {
    schema: {
      response: {
        200: {
          oneOf: [
            {
              type: 'object',
              required: ['id', 'username'],
              properties: {
                id: { type: 'number' },
                username: { type: 'string' },
                subscribed: { type: 'boolean' },
                avatarSrc: { type: 'string' },
                coverSrc: { type: 'string' },
              }
            },
            {
              type: 'null'
            }
          ]
        }
      }
    }
  }, async ({ headers }) => {
    const { userId } = await validateSession(headers)

    if (userId == null) {
      return null
    }

    return handlers.users.getUserById(userId, userId)
  })

  server.get('/users/me/subscriptions', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            user: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  slug: { type: 'string' }
                }
              }
            },
            stream: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  slug: { type: 'string' }
                }
              }
            },
            tag: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  slug: { type: 'string' }
                }
              }
            },
          }
        }
      }
    }
  }, async ({ headers }) => {
    const { userId } = await validateSession(headers)

    if (userId) {
      return handlers.my.getMySubscriptions(userId)
    }

    return {}
  })

  server.get('/users/me/chats', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              initiator: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  username: { type: 'string' },
                  avatarSrc: { type: 'string' },
                  coverSrc: { type: 'string' },
                  subscribed: { type: 'boolean' },
                }
              },
              recepient: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  username: { type: 'string' },
                  avatarSrc: { type: 'string' },
                  coverSrc: { type: 'string' },
                  subscribed: { type: 'boolean' },
                }
              },
              unreadCount: { type: 'number' },
              createdAt: { type: 'number' },
              updatedAt: { type: 'number' },
            }
          }
        }
      }
    }
  }, async ({ headers }) => {
    try {
      const { userId } = await validateSession(headers, true)

      return handlers.chats.getChatsOfUser(userId!)
    } catch (e) {
      return []
    }
  })

  server.post<{
    Params: {
      userId: string
    }
    Body: {
      bio: string
      firstName: string
      lastName: string
      dateOfBirth: number
      country: string
      city: string
    }
  }>('/users/me/profile', {
    schema: {
      body: {
        type: 'object',
        properties: {
          bio: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          dateOfBirth: { type: 'number' },
          country: { type: 'string' },
          city: { type: 'string' },
        }
      }
    }
  }, async ({ headers, body }) => {
    const { userId } = await validateSession(headers, true)

    return handlers.profile.updateProfile(userId!, body)
  })

  server.post<{
    Body: {
      id: number
    }
  }>('/users/me/avatar', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['id'],
        properties: {
          id: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async ({ headers, body: { id: uploadId } }) => {
    const { userId } = await validateSession(headers, true)

    await handlers.users.setAvatar(userId!, uploadId)
  })

  server.post<{
    Body: {
      id: number
    }
  }>('/users/me/cover', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['id'],
        properties: {
          id: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async ({ headers, body: { id: uploadId } }) => {
    const { userId } = await validateSession(headers, true)

    await handlers.users.setCover(userId!, uploadId)
  })

  server.post<{
    Body: {
      title: string
      content: object
      tags: string[]
    }
  }>('/posts', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'content', 'tags'],
        properties: {
          title: { type: 'string', minLength: 1, maxLength: 255 },
          content: {},
          tags: {
            type: 'array',
            items: { type: 'string', minLength: 1, maxLength: 255 }
          }
        }
      }
    }
  }, async ({ headers, body }) => {
    const { userId } = await validateSession(headers, true)

    await handlers.posts.createPost(userId!, body)
  })

  server.get<{
    Params: {
      postId: string
    }
  }>('/posts/:postId', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id'],
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  slug: { type: 'string' },
                }
              }
            },
            content: {},
            commentsCount: { type: 'number' },
            authorId: { type: 'number' },
            title: { type: 'string' },
            subscribed: { type: 'boolean' },
            createdAt: { type: 'number' },
            upatedAt: { type: 'number' }
          }
        }
      }
    }
  }, async ({ headers, params: { postId: postIdStr } }) => {
    const { userId } = await validateSession(headers)
    const postId = parseNumber(postIdStr)

    return handlers.posts.getPostById(userId, postId)
  })

  server.get<{
    Params: {
      postId: string
    }
  }>('/posts/:postId/comments', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              postId: { type: 'number' },
              authorId: { type: 'number' },
              parentId: {
                oneOf: [
                  { type: 'number' },
                  { type: 'null' }
                ]
              },
              content: {},
              createdAt: { type: 'number' },
              updatedAt: { type: 'number' },
            }
          }
        }
      }
    }
  }, async ({ headers, params: { postId: postIdStr } }) => {
    const { userId } = await validateSession(headers)
    const postId = parseNumber(postIdStr)

    return handlers.comments.getCommentsOfPost(userId, postId)
  })

  server.post<{
    Body: {
      content: object
      parentId?: number
    },
    Params: {
      postId: string
    }
  }>('/posts/:postId/comments', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['content'],
        properties: {
          content: {},
          parentId: { type: 'number', minimum: 1 }
        }
      }
    }
  }, async ({ headers, params: { postId: postIdStr }, body: { parentId, content } }) => {
    const { userId } = await validateSession(headers, true)
    const postId = parseNumber(postIdStr)

    return handlers.comments.createComment(userId!, {
      postId,
      parentId,
      content
    })
  })

  server.get<{
    Querystring: {
      slug?: string
      fuzzyTitle?: string
    }
  }>('/streams', {
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          slug: { type: 'string', minLength: 1, maxLength: 255 },
          fuzzyTitle: { type: 'string', minLength: 1, maxLength: 255 },
        }
      },
      response: {
        200: {
          id: { type: 'number'},
          title: { type: 'string'},
          slug: { type: 'string'},
          subscribed: { type: 'boolean'},
        }
      }
    }
  }, async ({ headers, query: { slug, fuzzyTitle } }) => {
    const { userId } = await validateSession(headers)

    if (fuzzyTitle) {
      return handlers.streams.findStreamsByTitleFuzzy(userId, fuzzyTitle)
    } else
      if (slug) {
        return handlers.streams.getStreamBySlug(userId, slug)
      }

    return null
  })

  server.post<{
    Params: {
      streamId: string
    },
    Body: {
      type: 'stream' | 'tag'
    }
  }>('/streams/:streamId/subscribe', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['type'],
        properties: {
          type: { enum: ['stream', 'tag'] }
        }
      }
    }
  }, async ({ headers, params: { streamId: streamIdStr }, body: { type } }) => {
    const { userId } = await validateSession(headers, true)
    const streamId = parseNumber(streamIdStr)

    await handlers.streams.subscribeToUser(userId!, streamId, type)
  })

  server.post<{
    Params: {
      streamId: string
    },
    Body: {
      type: 'stream' | 'tag'
    }
  }>('/streams/:streamId/unsubscribe', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['type'],
        properties: {
          type: { enum: ['stream', 'tag'] }
        }
      }
    }
  }, async ({ headers, params: { streamId: streamIdStr }, body: { type } }) => {
    const { userId } = await validateSession(headers, true)
    const streamId = parseNumber(streamIdStr)

    await handlers.streams.unsubscribeFromUser(userId!, streamId, type)
  })

  server.get<{
    Params: {
      streamId: string
    },
    Querystring: {
      limit: string
      offset: string
    }
  }>('/streams/:streamId/posts', {
    schema: {
      params: {
        type: 'object',
        required: ['streamId'],
        properties: {
          streamId: { type: 'number', minimum: 1 }
        }
      },
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          limit: { type: 'number', minimum: 1 },
          offset: { type: 'number', minimum: 0 },
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  tags: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id'],
                      properties: {
                        id: { type: 'number' },
                        title: { type: 'string' },
                        slug: { type: 'string' },
                      }
                    }
                  },
                  content: {},
                  commentsCount: { type: 'number' },
                  authorId: { type: 'number' },
                  title: { type: 'string' },
                  subscribed: { type: 'boolean' },
                  createdAt: { type: 'number' },
                  upatedAt: { type: 'number' }
                }
              }
            }
          }
        }
      }
    }
  }, async ({ headers, params: { streamId: streamIdStr }, query: { limit: limitStr, offset: offsetStr } }) => {
    const { userId } = await validateSession(headers)
    const streamId = parseNumber(streamIdStr)
    const limit = parseNumber(limitStr)
    const offset = parseNumber(offsetStr)

    return handlers.streams.getPostsOfStream(userId, streamId, { limit, offset })
  })

  server.get<{
    Params: {
      chatId: string
    }
  }>('/chats/:chatId/messages', {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              chatId: { type: 'number' },
              authorId: { type: 'number' },
              content: {},
              createdAt: { type: 'number' },
              updatedAt: { type: 'number' },
            }
          }
        }
      }
    }
  }, async ({ headers, params: { chatId: chatIdStr } }) => {
    await validateSession(headers, true)
    const chatId = parseNumber(chatIdStr)

    if (chatId === -1) return []

    return handlers.chats.getMessages(chatId)
  })

  server.post<{
    Params: {
      chatId: string
    }
  }>('/chats/:chatId/messages/mark_read', async ({ headers, params: { chatId: chatIdStr } }) => {
    const { userId: myId } = await validateSession(headers, true)
    const chatId = parseNumber(chatIdStr)

    await handlers.chats.markRead(chatId, myId!)
  })

  server.post<{
    Params: {
      chatId: string
    },
    Body: {
      recepientId: number
      content: object
    }
  }>('/chats/:chatId/messages', {
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['content'],
        properties: {
          recepientId: { type: 'number', minimum: 1 },
          content: {}
        }
      }
    }
  }, async ({ headers, params: { chatId: chatIdStr }, body: { content, recepientId } }) => {
    const { userId: myId } = await validateSession(headers, true)
    let chatId = parseNumber(chatIdStr)

    if (chatId === -1) {
      ; ({ chatId } = await handlers.chats.createChat(myId!, recepientId))
    }

    await handlers.chats.sendMessage(chatId, myId!, recepientId, content)

    io.to(`user:${recepientId}`).emit('new-message')
  })

  server.post('/upload', async (req) => {
    const data = await req.file()

    if (!data) {
      throw new errorCodes.FST_ERR_VALIDATION('Expected data')
    }

    const fullFilename = path.join(process.env['UPLOADS_DIR']!, data.filename)

    await pump(data.file, createWriteStream(fullFilename))

    const uploadId = await uploadCreate({ filename: data.filename })

    return { id: uploadId }
  })

  await server.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: "full",
      deepLinking: true
    }
  })

  return server
}
