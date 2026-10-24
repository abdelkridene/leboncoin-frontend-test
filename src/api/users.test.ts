import { http, HttpResponse } from 'msw'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { users } from '@/test/fixtures'
import { getUsers } from './users'

describe('getUsers', () => {
  it('returns the users without their tokens', async () => {
    server.use(
      http.get(apiUrl('/users'), () => HttpResponse.json(users.map((user) => ({ ...user, token: 'secret' })))),
    )
    const result = await getUsers()
    expect(result).toEqual(users)
    expect(result[0]).not.toHaveProperty('token')
  })
})
