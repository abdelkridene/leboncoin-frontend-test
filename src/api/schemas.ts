import { z } from 'zod'

const idSchema = z.number().int().nonnegative()

const timestampSchema = z.union([
  z.number().nonnegative(),
  z.string().regex(/^\d+$/).transform(Number),
])

export const userSchema = z.object({
  id: idSchema,
  nickname: z.string(),
})

export const conversationSchema = z.object({
  id: idSchema,
  senderId: idSchema,
  senderNickname: z.string(),
  recipientId: idSchema,
  recipientNickname: z.string(),
  lastMessageTimestamp: timestampSchema,
})

export const messageSchema = z.object({
  id: idSchema,
  conversationId: idSchema,
  authorId: idSchema,
  timestamp: timestampSchema,
  body: z.string(),
})

export const createdResourceSchema = z.object({ id: idSchema })

export type User = z.infer<typeof userSchema>
export type Conversation = z.infer<typeof conversationSchema>
export type Message = z.infer<typeof messageSchema>
