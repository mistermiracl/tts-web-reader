import { useEffect, type DependencyList, type EffectCallback, useRef } from 'react';

export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }
  }, deps);
  // use effect with cleaup neeed to circumvent react strict mode
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
}