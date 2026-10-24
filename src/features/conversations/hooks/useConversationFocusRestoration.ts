import { useEffect, useRef } from 'react'

// Shared across page transitions on purpose: the list page needs to know which conversation the user came back from.
let lastViewedConversationId: number | null = null

export const useRememberViewedConversation = (conversationId: number) => {
  useEffect(() => {
    lastViewedConversationId = conversationId
  }, [conversationId])
}

export const useRestoreConversationFocus = <Element extends HTMLElement>(enabled: boolean) => {
  const containerRef = useRef<Element>(null)

  useEffect(() => {
    if (!enabled || lastViewedConversationId === null) return
    containerRef.current
      ?.querySelector<HTMLAnchorElement>(`a[href="/conversations/${lastViewedConversationId}"]`)
      ?.focus()
    lastViewedConversationId = null
  }, [enabled])

  return containerRef
}
