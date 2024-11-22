import { useState, useRef } from "react";

// Custom hook that mimics ReactiveVar
export default function useReactiveVar(initialValue) {
  const [value, setValue] = useState(initialValue);
  const subscribers = useRef(new Set());

  const notifySubscribers = () => {
    subscribers.current.forEach((subscriber) => subscriber(value));
  };

  const set = (newValue) => {
    if (newValue !== value) {
      setValue(newValue);
      notifySubscribers();
    }
  };

  const get = () => value;

  const subscribe = (subscriber) => {
    subscribers.current.add(subscriber);
    // Cleanup when component unmounts or the subscriber is no longer needed
    return () => subscribers.current.delete(subscriber);
  };

  const pop = () => {
    const val = [...value];
    val.pop();
    set(val);
  };
  const push = (elm) => {
    const val = [...value];
    val.push(elm);
    set(val);
  };

  return { get, set, subscribe, pop, push };
}
