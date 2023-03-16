import { useState, useEffect } from 'react';

const APP_PREFIX = "chat-app_";

const useLocalStorage = (key, initialValue) => {
    const PREFIXED_KEY = APP_PREFIX + key;

    const [value, setValue] = useState(() => {
        const data = localStorage.getItem(PREFIXED_KEY);
        if (data != null || data != "undefined") return JSON.parse(data);
        if (typeof initialValue === "function") return initialValue();
        else return initialValue;
    });

    useEffect(() => {
        localStorage.setItem(PREFIXED_KEY, JSON.stringify(value));
    }, [value, PREFIXED_KEY]);

    return [value, setValue];
}

export default useLocalStorage;