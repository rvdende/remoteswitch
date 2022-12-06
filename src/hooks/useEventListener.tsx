// https://stackoverflow.com/a/57926311

import { useRef, useEffect } from "react";

/** 
 * Example:
 * ```tsx
import useEventListener from '@use-it/event-listener'

const ESCAPE_KEYS = ['27', 'Escape'];

const App = () => {
  function handler({ key }) {
    if (ESCAPE_KEYS.includes(String(key))) {
      console.log('Escape key pressed!');
    }
  }

  useEventListener('keydown', handler);

  return <span>hello world</span>;
}
```
 */
export function useEventListener<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => unknown, element = window) {
  // Create a ref that stores handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const savedHandler = useRef<any>();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener: EventListenerOrEventListenerObject = (event) => savedHandler.current(event);

      // Add event listener
      element.addEventListener(type, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(type, eventListener);
      };
    },
    [type, element] // Re-run if eventName or element changes
  );
}