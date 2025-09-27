import { eq } from 'drizzle-orm'
import { defineEventHandler, createError, readValidatedBody } from 'h3'
import { z } from 'zod'

import { useDb } from '../../db'
import { users } from '../../db/schema'
import { createSession, verifyPassword } from '../../utils/auth'

const loginSchema = z.object({
  email: z.string().email('Adresse courriel invalide').transform(value => value.toLowerCase()),
  password: z.string().min(1, 'Le mot de passe est requis')
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => loginSchema.parse(data))
  const db = useDb(event)

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  })

  if (!existingUser) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.'
    })
  }

  const validPassword = await verifyPassword(body.password, existingUser.passwordHash)

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Identifiants invalides.'
    })
  }

  const { session } = await createSession(event, existingUser.id)

  const user = {
    id: existingUser.id,
    email: existingUser.email,
    displayName: existingUser.displayName,
    createdAt: existingUser.createdAt.toISOString()
  }

  event.context.auth = {
    user,
    session
  }

  return {
    user
  }
})
