"use client";

import React, {useEffect} from 'react';
import {useGeneral} from "@/context/GeneralContext";

const LogoutPage = () => {

    const {logout} = useGeneral();

    useEffect(() => {
        logout()
    }, [logout]);

    return (
        <div>
            <h1>Cerrando sesión...</h1>
        </div>
    );
};

export default LogoutPage;