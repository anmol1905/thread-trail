import { useContext } from 'react';
import { ThreadTrailContext } from '../context/ThreadTrailContext';

export function useThreadTrail() {
  const ctx = useContext(ThreadTrailContext);
  if (!ctx) {
    throw new Error('useThreadTrail must be used inside ThreadTrailProvider');
  }
  return ctx;
}
