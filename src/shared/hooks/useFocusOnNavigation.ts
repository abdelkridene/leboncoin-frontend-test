import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const subscribe = () => () => undefined

// Hydration renders with the server snapshot, so only components of the initial page load see `true`.
const useIsHydrating = () =>
  useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  )

export const useFocusOnNavigation = <Element extends HTMLElement>(enabled: boolean) => {
  const ref = useRef<Element>(null)
  const isHydrating = useIsHydrating()
  // A full page load keeps the browser's default focus; only in-app navigations move it.
  const [isInitialPageLoad] = useState(isHydrating)

  useEffect(() => {
    if (enabled && !isInitialPageLoad) ref.current?.focus()
  }, [enabled, isInitialPageLoad])

  return ref
}
