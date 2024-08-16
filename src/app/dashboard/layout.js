"use client";

import {useState} from "react";
import Navbar from "@/componentes/Navbar";
import {IoCloseOutline, IoMenuOutline} from "react-icons/io5";


export default function DashboardLayout ({children}) {
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);

    const toggleNavbar = () => {
        setIsNavbarVisible(!isNavbarVisible);
    }

    return (
        <>
            <div
                className="bg-slate-100 w-screen h-screen antialiased text-slate-300 selection:bg-blue-600 selection:text-white">
                <div className="flex h-full">

                    {/* Barra de Navegación Fija (en móviles será oculta) */}
                    <div className={`fixed top-0 left-0 w-60 h-full transition-transform duration-300 ${
                        isNavbarVisible ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}>
                        <Navbar/>
                    </div>

                    {/* Botón de toggle para mostrar/ocultar la barra de navegación en móviles */}
                    <button
                        className="absolute top-4 left-4 z-20 md:hidden p-2 bg-blue-600 text-white rounded focus:outline-none"
                        onClick={toggleNavbar}
                    >
                        {isNavbarVisible ? <IoCloseOutline size={24}/> : <IoMenuOutline size={24}/>}
                    </button>

                    {/* Contenido Desplazable */}
                    <div className="ml-0 md:ml-60 p-4 w-full h-full overflow-y-auto text-slate-900">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}