"use client";

import {jwtDecode} from 'jwt-decode';

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import api from "@/api/apiInterceptor";
import {router} from "next/navigation";
import { navbarItems } from "@/config/navbarItems";
import useLocalStorage from "@/componentes/useLocalStorage";


const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {

    const [user, setUser] = useLocalStorage('user', null);
    const [users, setUsers] = useLocalStorage('users', []);
    const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);


    const checkTokenValidity = useCallback((token) => {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            handleLogout();
        } else {
            setUser(decoded);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
        }
    }, [router]);


    const login = useCallback(async (email, password) => {
        try {
            const res = await api.post('/auth/login', {email, password});
            const token = res.data.token;
            checkTokenValidity(token);
        } catch (e) {
            console.log(e);
        }
    }, [checkTokenValidity]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setUsers([]);
        setIsAuthenticated(false);
        router.push('/login');
    }, [router]);

    // navbar
    const filteredNavbarItems = useMemo(() => {
        if (user && user.role) {
            return navbarItems.filter(item => item.roles.includes(user.role));
        }
        return [];
    }, [user]);

    const value = useMemo(() => ({
        user,
        login,
        logout: handleLogout,
        isAuthenticated,
        navbarItems: filteredNavbarItems,
    }), [
        user,
        login,
        handleLogout,
        isAuthenticated,
        filteredNavbarItems
    ]);

    return (
        <GeneralContext.Provider value={value}>
            {children}
        </GeneralContext.Provider>
    );
};

export const useGeneral = () => useContext(GeneralContext);