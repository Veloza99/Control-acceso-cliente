"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Button, Snackbar, Alert } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../../api/apiInterceptor';
import { useGeneral } from '@/context/GeneralContext';

const InicioPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [accessGranted, setAccessGranted] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [userStatus, setUserStatus] = useState(''); // Estado para manejar el estado del usuario
    const { getImagenPerfil } = useGeneral();

    useEffect(() => {
        if (!scanResult) {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: { width: 250, height: 250 },
                fps: 5,
            });

            let isScanning = true;

            scanner.render(success, error);

            function success(result) {
                if (isScanning) {
                    scanner.clear();
                    const userData = JSON.parse(result);
                    setScanResult(userData);
                    isScanning = false;

                    fetchUserProfile(userData.identificacion);
                    fetchUserStatus(userData.identificacion); // Obtener el estado más reciente
                }
            }

            function error(err) {
                console.warn(err);
            }

            return () => {
                scanner.clear();
            };
        }
    }, [scanResult]);

    const fetchUserProfile = async (identificacion) => {
        try {
            const response = await api.get(`/user/${identificacion}`);
            setUserProfile(response.data);

            if (response.data.picProfile) {
                const image = await getImagenPerfil(response.data.picProfile);
                setProfileImage(image);
            } else {
                setProfileImage(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchUserStatus = async (identificacion) => {
        try {
            const response = await api.get(`/entry/user-all/${identificacion}`);
            if (response.data.length > 0) {
                // Ordenar por fecha y hora y tomar el más reciente
                const sortedHistorial = response.data.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
                setUserStatus(sortedHistorial[0].status);
            } else {
                setUserStatus('No tiene entradas registradas');
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
        }
    };

    const getColorByStatus = (status) => {
        switch (status) {
            case 'Activo':
                return 'bg-green-500'; // Verde para activo
            case 'Inactivo':
                return 'bg-red-500'; // Rojo para inactivo
            case 'No tiene entradas registradas':
                return 'bg-gray-500'; // Gris para no registrado
            default:
                return 'bg-blue-500'; // Azul por defecto
        }
    };

    const handleGrantAccess = async () => {
        try {
            await api.post('/entry/user-entry', {
                identificacion: userProfile.identificacion,
                entryTime: new Date().toISOString(),
            });
            setAccessGranted(true);
            setButtonsVisible(false);
            setSnackbarMessage('Acceso otorgado correctamente');
            setOpenSnackbar(true);
            // Volver a obtener el estado después de otorgar acceso
            fetchUserStatus(userProfile.identificacion);
        } catch (error) {
            console.error('Error granting access:', error);
        }
    };

    const handleDenyAccess = () => {
        setScanResult(null);
        setUserProfile(null);
        setAccessGranted(false);
        setButtonsVisible(true);
        setUserStatus(''); // Reiniciar estado
    };

    const handleRegisterExit = async () => {
        try {
            await api.post('/entry/user-exit', {
                identificacion: userProfile.identificacion,
            });
            setButtonsVisible(false);
            setSnackbarMessage('Salida registrada correctamente');
            setOpenSnackbar(true);
            // Volver a obtener el estado después de registrar salida
            fetchUserStatus(userProfile.identificacion);
        } catch (error) {
            console.error('Error registering exit:', error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setScanResult(null);
        setButtonsVisible(true);
    };

    return (
        <div className="p-6 flex items-center justify-center min-h-screen">
            {userProfile ? (
                <div className="flex flex-col items-center">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
                        <div className="flex flex-col items-center">
                            <div className="mb-6">
                                <div>
                                    <label className="block text-xl font-medium text-blue-800">Nombre</label>
                                    <p className="mt-1 text-lg text-gray-700">{userProfile.firstName}</p>
                                </div>
                                <div>
                                    <label className="block text-xl font-medium text-blue-800">Apellido</label>
                                    <p className="mt-1 text-lg text-gray-700">{userProfile.lastName}</p>
                                </div>
                                <div>
                                    <label className="block text-xl font-medium text-blue-800">Identificación</label>
                                    <p className="mt-1 text-lg text-gray-700">{userProfile.identificacion}</p>
                                </div>
                                <div>
                                    <label className="block text-xl font-medium text-blue-800">Correo Electrónico</label>
                                    <p className="mt-1 text-lg text-gray-700">{userProfile.email}</p>
                                </div>
                                <div>
                                    <label className="block text-xl font-medium text-blue-800">Rol</label>
                                    <p className="mt-1 text-lg text-gray-700">{userProfile.role}</p>
                                </div>
                            </div>

                            <div className="mt-1">
                                <p className="block text-xl font-medium text-blue-800">Foto</p>
                                {profileImage ? (
                                    <img src={profileImage} alt="Perfil" className="w-32 h-32 object-cover"/>
                                ) : (
                                    <div
                                        className="w-32 h-32 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-500">
                                        <p>No tiene foto</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <p className="block text-xl font-medium text-blue-800">Estado Actual</p>
                                <span className={`inline-block px-2 py-1 ${getColorByStatus(userStatus)} text-white rounded-full`}>
                                    {userStatus}
                                </span>
                            </div>
                        </div>
                        {buttonsVisible && (
                            <div className="mt-4 flex gap-4">
                                <Button variant="contained" color="success" onClick={handleGrantAccess}>
                                    Otorgar Acceso
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDenyAccess}>
                                    Denegar Acceso
                                </Button>
                                <Button variant="contained" color="info" onClick={handleRegisterExit}>
                                    Registrar Salida
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div id="reader" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}></div>
                    <Typography variant="body1" className="mt-4">
                        Escanea el código QR.
                    </Typography>
                </div>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={accessGranted ? 'success' : 'info'} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default InicioPage;
