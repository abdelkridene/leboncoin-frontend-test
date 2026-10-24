import { z } from 'zod'

export const MAX_MESSAGE_LENGTH = 1000

const messageBodySchema = z.string().trim().min(1).max(MAX_MESSAGE_LENGTH)

export const validateMessageBody = (draft: string): string | null => {
  const result = messageBodySchema.safeParse(draft)
  return result.success ? result.data : null
}
