import React, { useState, useEffect } from 'react';
import useIsClient from '@/componentes/useIsClient';
import Image from "next/image";
import Link from "next/link";
import { useGeneral } from '@/context/GeneralContext';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import YoutubeSearchedForOutlinedIcon from '@mui/icons-material/YoutubeSearchedForOutlined';
import PersonIcon from '@mui/icons-material/Person';

const Navbar = () => {
    const { user, isAuthenticated, navbarItems, getImagenPerfil } = useGeneral();
    const [picProfile, setPicProfile] = useState('');
    const isClient = useIsClient(); // Usar el hook para verificar si es cliente

    // Función para obtener la imagen de perfil del usuario
    useEffect(() => {
        const fetchProfileImage = async () => {
            if (user && user.picProfile) {  // Asumimos que `picProfile` es una propiedad del usuario
                const image = await getImagenPerfil(user.picProfile);
                setPicProfile(image);
            } else {
                setPicProfile(null);
            }
        };

        fetchProfileImage();
    }, [user, getImagenPerfil]);

    if (!isClient || !isAuthenticated) {
        return null; // No mostrar la barra de navegación si no está autenticado o no está en el cliente
    }

    const iconMap = {
        'inicio_icon': <HomeIcon style={{ color: 'white' }} />,
        'scan_icon': <QrCodeScannerOutlinedIcon style={{ color: 'white' }} />,
        'perfil_icon': <AssignmentIndIcon style={{ color: 'white' }} />,
        'usuarios_icon': <FolderSharedIcon style={{ color: 'white' }} />,
        'visitor_icon': <AccountBoxOutlinedIcon style={{ color: 'white' }} />,
        'entradas_salidas_icon': <HistoryOutlinedIcon style={{ color: 'white' }} />,
        'entradas_salidas_visitor_icon': <YoutubeSearchedForOutlinedIcon style={{ color: 'white' }} />,
        'horarios_icon': <AccessTimeOutlinedIcon style={{ color: 'white' }} />,
        'reportes_icon': <ArticleOutlinedIcon style={{ color: 'white' }} />,
        'configuracion_icon': <PermDataSettingOutlinedIcon style={{ color: 'white' }} />,
        'administracion_icon': <SupervisorAccountOutlinedIcon style={{ color: 'white' }} />,
        'logout_icon': <LogoutOutlinedIcon style={{ color: 'white' }} />,
    };

    return (
        <div id="menu" className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 fixed left-0 h-screen overflow-y-scroll">
            <div id="logo" className="my-4 px-6">
                <h1 className="text-lg md:text-2xl font-bold text-white"><span className="text-blue-500">Control de Acceso al Campus Universitario</span></h1>
                <p className="text-slate-500 text-sm"></p>
            </div>
            <div id="profile" className="px-6 py-10">
                <p className="text-slate-500">Bienvenido(a),</p>
                <Link href="#" className="inline-flex space-x-2 items-center">
                    <span>
                        {picProfile ? (
                            <img src={picProfile} alt="picprofile" height="30" width="30" className="rounded-full"/>
                        ) : (
                            <PersonIcon style={{ color: 'white' }} className="w-8 h-8" />
                        )}
                    </span>
                    <span className="text-sm md:text-base font-bold">
                        {user?.firstName || 'User'}
                    </span>
                </Link>
                <p className="text-slate-500 text-sm text-blue">
                    {user?.role.toUpperCase() || 'ROL'}
                </p>
            </div>
            <div id="nav" className="w-full px-6">
                {navbarItems.map((item, index) => (
                    <Link href={item.link} key={index} className="w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py-3 hover:bg-white/5 transition ease-linear duration-150">
                        <div>
                            {iconMap[item.icon] || <div className="w-6 h-6"></div>}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold leading-5 text-white">{item.title}</span>
                            <span className="text-sm text-white/50 hidden md:block">{item.description}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Navbar;
