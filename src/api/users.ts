import { z } from 'zod'
import { request } from './httpClient'
import { userSchema, type User } from './schemas'

export const getUsers = (signal?: AbortSignal): Promise<User[]> =>
  request('/users', z.array(userSchema), { signal })
