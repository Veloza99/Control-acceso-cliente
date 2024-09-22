import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
    // Estado inicial
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            // Intentar parsear el JSON
            try {
                return JSON.parse(item);
            } catch {
                // Si falla, retornar el item directamente
                return item;
            }
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Función para actualizar el valor
    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                if (typeof valueToStore === 'object') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                } else {
                    window.localStorage.setItem(key, valueToStore);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export default useLocalStorage;
