"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from"react";
import api from"@/api/apiInterceptor";
import { useRouter } from"next/navigation";
import useLocalStorage from"@/componentes/useLocalStorage";
import {navbarItems} from "@/config/navbarItems";
import {jwtDecode} from "jwt-decode";

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage('user', null);
    const [users, setUsers] = useLocalStorage('users', []);
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
    const [token, setToken] = useLocalStorage('token', undefined);

    const router = useRouter();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setUsers([]);
        setIsAuthenticated(false);
        router.push('/login');
    }, [router]);

    const checkTokenValidity = useCallback((token) => {
        if (token !== null && token !== undefined && token !== '') {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    handleLogout();
                } else {
                    setUser(decoded);
                    setIsAuthenticated(true);
                    localStorage.setItem('token', token);
                }
            } catch (error) {
                console.error("Invalid token format or error decoding token", error);
                handleLogout();
            }
        }
    }, [handleLogout]);

    useEffect(() => {
        if (token) {
            checkTokenValidity(token);
        }
    }, [token, checkTokenValidity]);

    const login = useCallback(async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const token = res.data.token;
            setToken(token);
            localStorage.setItem('token', token);
            checkTokenValidity(token);
        } catch (e) {
            console.log("Error during login", e);
        }
    }, [checkTokenValidity]);

    const filteredNavbarItems = useMemo(() => {
        if (user && user.role) {
            return navbarItems.filter(item => item.roles.includes(user.role));
        }
        return [];
    }, [user]);

    const getImagenPerfil = useCallback(async (imagen) => {
        try {
            const response = await api.get(`/static/images/${imagen}`, { responseType: 'blob' });
            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error('Failed to get user profile pic', error);
            return null;
        }
    }, []);

    const value = useMemo(() => ({
        user,
        login,
        logout: handleLogout,
        isAuthenticated,
        navbarItems: filteredNavbarItems,
        getImagenPerfil,
    }), [
        user,
        login,
        handleLogout,
        isAuthenticated,
        filteredNavbarItems,
        getImagenPerfil
    ]);

    return (
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    );


};

export const useGeneral = () => useContext(GeneralContext);
