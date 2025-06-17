import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
/**
 * UseDelay
 * when argument changes, schedule call
 */
export function useDelay(call, timeout) {
  const timeoutRef = useRef();
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback( (...params) => {
    // ClearOut timer for previous handler.
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      call(...params)
    }, timeout || 300);
  }, [call, timeout])
}
