import { useState, useEffect } from "react";

export function useLocalStorage(initolstate, key) {
  const [value, setvalue] = useState(function () {
    const storeValue = localStorage.getItem(key);
    return storeValue ? JSON.parse(storeValue) : initolstate;
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setvalue];
}
