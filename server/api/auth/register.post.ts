import { randomUUID } from 'node:crypto'

import { eq } from 'drizzle-orm'
import { defineEventHandler, createError, readValidatedBody } from 'h3'
import { z } from 'zod'

import { useDb } from '../../db'
import { users } from '../../db/schema'
import { createSession, hashPassword } from '../../utils/auth'

const registerSchema = z.object({
  email: z.string().email('Adresse courriel invalide').transform(value => value.toLowerCase()),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(72, 'Le mot de passe ne peut dépasser 72 caractères'),
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(120, 'Le nom ne peut dépasser 120 caractères')
    .transform(value => value.trim())
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, data => registerSchema.parse(data))
  const db = useDb(event)

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  })

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Un compte existe déjà avec cette adresse courriel.'
    })
  }

  const now = new Date()
  const userId = randomUUID()
  const passwordHash = await hashPassword(body.password)

  await db.insert(users).values({
    id: userId,
    email: body.email,
    passwordHash,
    displayName: body.name,
    createdAt: now,
    updatedAt: now
  })

  const { session } = await createSession(event, userId)

  const user = {
    id: userId,
    email: body.email,
    displayName: body.name,
    createdAt: now.toISOString()
  }

  event.context.auth = {
    user,
    session
  }

  return {
    user
  }
})
