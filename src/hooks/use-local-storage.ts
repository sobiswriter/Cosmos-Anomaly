"use client";

import { useState, useEffect, useCallback } from 'react';

function parseJSON<T>(value: string | null): T | undefined {
  try {
    return value === 'undefined' ? undefined : JSON.parse(value ?? '');
  } catch {
    console.log('parsing error on', { value });
    return undefined;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
    const readValue = useCallback((): T => {
        if (typeof window === 'undefined') {
            return initialValue instanceof Function ? initialValue() : initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return parseJSON(item) as T;
            }
            return initialValue instanceof Function ? initialValue() : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue instanceof Function ? initialValue() : initialValue;
        }
    }, [initialValue, key]);

    const [storedValue, setStoredValue] = useState<T>(initialValue instanceof Function ? initialValue() : initialValue);
    
    // This is the key change to prevent hydration mismatch.
    // We only read from localStorage on the client, after the component has mounted.
    useEffect(() => {
        setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const newValue = value instanceof Function ? value(storedValue) : value;
            setStoredValue(newValue);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(newValue));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue) {
                try {
                    setStoredValue(parseJSON(e.newValue) as T);
                } catch (error) {
                    console.warn(`Error parsing storage change for key "${key}":`, error);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}