import { getLoggedUserId } from '@/utils/getLoggedUserId'

export const useLoggedUserId = (): number => getLoggedUserId()
