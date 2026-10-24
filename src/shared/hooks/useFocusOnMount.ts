import { useEffect, useRef } from 'react'

export const useFocusOnMount = <Element extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<Element>(null)

  useEffect(() => {
    if (enabled) ref.current?.focus()
  }, [enabled])

  return ref
}
