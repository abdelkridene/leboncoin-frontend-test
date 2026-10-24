import { useEffect, useRef } from 'react'

export const useScrollToBottom = <Element extends HTMLElement>(trigger: unknown) => {
  const containerRef = useRef<Element>(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [trigger])

  return containerRef
}
