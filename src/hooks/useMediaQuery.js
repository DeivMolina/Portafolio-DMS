import { useCallback, useSyncExternalStore } from 'react';

/** Keep the server and hydration snapshots identical, then read live preferences. */
export default function useMediaQuery(query) {
  const getSnapshot = useCallback(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false, [query]);
  const subscribe = useCallback(listener => {
    if (typeof window.matchMedia !== 'function') return () => {};
    const media = window.matchMedia(query);
    if (media.addEventListener) media.addEventListener('change', listener);
    else media.addListener(listener);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', listener);
      else media.removeListener(listener);
    };
  }, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
