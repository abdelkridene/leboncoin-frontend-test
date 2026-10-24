import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/api/queryKeys'
import { getUsers } from '@/api/users'

const USERS_STALE_TIME_MS = 5 * 60_000

export const useUsers = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.users(),
    queryFn: ({ signal }) => getUsers(signal),
    staleTime: USERS_STALE_TIME_MS,
    enabled,
  })
