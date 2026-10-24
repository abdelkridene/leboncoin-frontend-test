import type { Message } from '@/api/schemas'

export const sortByTimestamp = (messages: Message[]): Message[] =>
  [...messages].sort((a, b) => a.timestamp - b.timestamp || a.id - b.id)
