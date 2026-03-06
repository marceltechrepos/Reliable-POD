import { useRef, useCallback } from "react";

export const useEditorHistory = () => {
  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const HISTORY_LIMIT = 60;

  const recordHistory = useCallback((state) => {
    try {
      historyRef.current.push(JSON.parse(JSON.stringify(state)));
    } catch {
      historyRef.current.push(state);
    }
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    futureRef.current = [];
  }, []);

  const undo = useCallback((currentState) => {
    if (historyRef.current.length === 0) return null;

    const last = historyRef.current.pop();
    try {
      futureRef.current.push(JSON.parse(JSON.stringify(currentState)));
    } catch {
      futureRef.current.push(currentState);
    }

    return last; // ✅ Sirf state return karo, setState nahi
  }, []);

  const redo = useCallback((currentState) => {
    if (futureRef.current.length === 0) return null;

    const next = futureRef.current.pop();
    try {
      historyRef.current.push(JSON.parse(JSON.stringify(currentState)));
    } catch {
      historyRef.current.push(currentState);
    }

    return next; // ✅ Sirf state return karo, setState nahi
  }, []);

  return { recordHistory, undo, redo };
};