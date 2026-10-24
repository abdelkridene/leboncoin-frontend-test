import { http, HttpResponse, delay } from 'msw'
import { z } from 'zod'
import { server } from '@/test/server'
import { apiUrl } from '@/test/handlers'
import { request } from './httpClient'
import { HttpError, InvalidResponseError, TimeoutError } from './errors'

const schema = z.object({ value: z.string() })

describe('request', () => {
  it('returns the validated payload', async () => {
    server.use(http.get(apiUrl('/thing'), () => HttpResponse.json({ value: 'ok', extra: true })))
    await expect(request('/thing', schema)).resolves.toEqual({ value: 'ok' })
  })

  it('sends a JSON body on POST', async () => {
    let receivedBody: unknown
    let contentType: string | null = null
    server.use(
      http.post(apiUrl('/thing'), async ({ request: incoming }) => {
        receivedBody = await incoming.json()
        contentType = incoming.headers.get('content-type')
        return HttpResponse.json({ value: 'created' })
      }),
    )
    await request('/thing', schema, { method: 'POST', body: { name: 'a' } })
    expect(receivedBody).toEqual({ name: 'a' })
    expect(contentType).toBe('application/json')
  })

  it('throws an HttpError with the status on non-2xx responses', async () => {
    server.use(http.get(apiUrl('/thing'), () => new HttpResponse(null, { status: 503 })))
    await expect(request('/thing', schema)).rejects.toEqual(new HttpError(503))
  })

  it('throws InvalidResponseError when the payload does not match the schema', async () => {
    server.use(http.get(apiUrl('/thing'), () => HttpResponse.json({ value: 42 })))
    await expect(request('/thing', schema)).rejects.toBeInstanceOf(InvalidResponseError)
  })

  it('throws InvalidResponseError when the body is not JSON', async () => {
    server.use(http.get(apiUrl('/thing'), () => HttpResponse.text('<html>oops</html>')))
    await expect(request('/thing', schema)).rejects.toBeInstanceOf(InvalidResponseError)
  })

  it('throws TimeoutError when the server is too slow', async () => {
    server.use(
      http.get(apiUrl('/thing'), async () => {
        await delay('infinite')
        return HttpResponse.json({ value: 'late' })
      }),
    )
    await expect(request('/thing', schema, { timeoutMs: 20 })).rejects.toBeInstanceOf(TimeoutError)
  })

  it('propagates the abort when the caller cancels', async () => {
    server.use(
      http.get(apiUrl('/thing'), async () => {
        await delay('infinite')
        return HttpResponse.json({ value: 'late' })
      }),
    )
    const controller = new AbortController()
    const pending = request('/thing', schema, { signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('does not call the server when the signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(request('/thing', schema, { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
  })
})
