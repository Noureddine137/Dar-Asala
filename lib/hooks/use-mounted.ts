import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * SSR-safe "has this component mounted on the client yet" check, used to
 * defer rendering of client-only state (e.g. persisted Zustand stores) until
 * after hydration without a setState-in-effect render cascade.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
