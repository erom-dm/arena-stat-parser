import { useEffect, useRef, useState } from "react";

export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export function useLocalStorage<T>(
  key: string,
  initialValue: any
): [T, (val: any) => void, () => void] {
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setNewValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  const refreshState = () => {
    try {
      const item = window.localStorage.getItem(key);
      setNewValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setNewValue, refreshState];
}
