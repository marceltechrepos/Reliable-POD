import { useRef } from "react";

export const useEditorHistory = () => {
  const historyRef = useRef([]);
  const futureRef = useRef([]);
  const HISTORY_LIMIT = 60;

  const recordHistory = (state) => {
    try {
      historyRef.current.push(JSON.parse(JSON.stringify(state)));
    } catch {
      historyRef.current.push(state);
    }
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    futureRef.current = [];
  };

  const undo = (currentState, setState) => {
    if (historyRef.current.length === 0) return;
    const last = historyRef.current.pop();
    try {
      futureRef.current.push(JSON.parse(JSON.stringify(currentState)));
    } catch {
      futureRef.current.push(currentState);
    }
    setState(last);
  };

  const redo = (currentState, setState) => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop();
    try {
      historyRef.current.push(JSON.parse(JSON.stringify(currentState)));
    } catch {
      historyRef.current.push(currentState);
    }
    setState(next);
  };

  return { historyRef, futureRef, recordHistory, undo, redo };
};