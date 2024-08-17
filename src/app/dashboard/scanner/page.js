"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../../api/apiInterceptor';
import CheckIcon from '@mui/icons-material/Check';

const InicioPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [accessGranted, setAccessGranted] = useState(false);

    useEffect(() => {
        if (!document.getElementById('reader').children.length) { // Verifica si ya hay un escáner
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

                    fetchUserProfile(userData.userId);
                }
            }

            function error(err) {
                console.warn(err);
            }

            return () => {
                scanner.clear();
            };
        }
    }, []);

    const fetchUserProfile = async (userId) => {
        try {
            const response = await api.get(`/user/${userId}`);
            setUserProfile(response.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleGrantAccess = async () => {
        try {
            await api.post('/entry', {
                userId: userProfile._id,
                entryTime: new Date().toISOString(),
            });
            setAccessGranted(true); // Muestra el chulito verde
        } catch (error) {
            console.error('Error granting access:', error);
        }
    };

    const handleDenyAccess = () => {
        // Implementar lógica para denegar el acceso si es necesario
        console.log('Access denied');
    };

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Scanear QR
            </Typography>
            {userProfile ? (
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="grid grid-cols-1 gap-6">
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
                        <div className="mt-4 flex justify-between">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleGrantAccess}
                            >
                                Otorgar Acceso
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDenyAccess}
                            >
                                Denegar Acceso
                            </Button>
                        </div>
                        {accessGranted && (
                            <div className="mt-4 flex justify-center">
                                <CheckIcon color="success" fontSize="large" />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div id="reader" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}></div>
                    <Typography variant="body1" className="mt-4">
                        Escanea el código QR.
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default InicioPage;
