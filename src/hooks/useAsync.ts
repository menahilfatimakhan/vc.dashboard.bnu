"use client";

import { useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: unknown;
}

/**
 * Generic {data, loading, error} wrapper around a service-layer call. On first
 * mount `data` is undefined (render a full skeleton); on later filter/drill
 * changes the previous `data` stays rendered while `loading` flips true, rather
 * than flashing a full skeleton on every click.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(undefined);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    // Intentional: marks the start of an async fetch triggered by a dependency change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fn()
      .then((result) => {
        if (requestId.current === id) {
          setData(result);
          setError(undefined);
        }
      })
      .catch((err) => {
        if (requestId.current === id) setError(err);
      })
      .finally(() => {
        if (requestId.current === id) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
