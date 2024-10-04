"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import QrScanner from 'qr-scanner';
import api from '../../../api/apiInterceptor';
import { useGeneral } from '@/context/GeneralContext';
import { QrCodeScanner } from '@mui/icons-material';

const InicioPage = () => {
    const [scanResult, setScanResult] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [accessGranted, setAccessGranted] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [buttonsVisible, setButtonsVisible] = useState(true);
    const [userStatus, setUserStatus] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const { getImagenPerfil } = useGeneral();
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);

    useEffect(() => {
        if (!scanResult && videoRef.current && isScanning) {
            qrScannerRef.current = new QrScanner(videoRef.current, (result) => {
                handleScanSuccess(result);
            });

            qrScannerRef.current.start();

            return () => {
                if (qrScannerRef.current) {
                    qrScannerRef.current.stop();
                }
            };
        }
    }, [scanResult, isScanning]);

    const handleScanSuccess = (result) => {
        console.log('QR Code Result:', result);
        try {
            const userData = JSON.parse(result);
            setScanResult(userData);
            fetchUserProfile(userData.identificacion);
            fetchUserStatus(userData.identificacion);
        } catch (error) {
            console.error('Error parsing QR code result:', error);
            setSnackbarMessage('Código QR inválido. Inténtalo de nuevo.');
            setOpenSnackbar(true);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async () => {
                const imageDataUrl = reader.result;
                const result = await QrScanner.scanImage(imageDataUrl);
                handleScanSuccess(result);
            };
            reader.readAsDataURL(file);
        }
    };

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
                setUserStatus(response.data[0].status);
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
                return 'bg-green-500';
            case 'Inactivo':
                return 'bg-red-500';
            case 'No tiene entradas registradas':
                return 'bg-gray-500';
            default:
                return 'bg-blue-500';
        }
    };

    const startScanning = () => {
        setIsScanning(true);
    };

    const stopScanning = () => {
        if (qrScannerRef.current) {
            qrScannerRef.current.stop();
        }
        setTimeout(() => {
            setIsScanning(false);
        }, 1000);
    };

    const handleGrantAccess = async () => {
        try {
            await api.post('/entry/user-entry', {
                identificacion: userProfile.identificacion,
                entryTime: new Date().toISOString(),
            });
            setAccessGranted(true);
            setSnackbarMessage('Acceso otorgado correctamente');
            setOpenSnackbar(true);
            setTimeout(() => {
                resetState();
            }, 2000);
        } catch (error) {
            console.error('Error granting access:', error);
        }
    };

    const handleDenyAccess = () => {
        setSnackbarMessage('Acceso denegado');
        setOpenSnackbar(true);
        setTimeout(() => {
            resetState();
        }, 2000);
    };

    const handleRegisterExit = async () => {
        try {
            await api.post('/entry/user-exit', {
                identificacion: userProfile.identificacion,
            });
            setSnackbarMessage('Salida registrada correctamente');
            setOpenSnackbar(true);
            setTimeout(() => {
                resetState();
            }, 2000);
        } catch (error) {
            console.error('Error registering exit:', error);
        }
    };

    const resetState = () => {
        setScanResult(null);
        setUserProfile(null);
        setProfileImage(null);
        setAccessGranted(false);
        setButtonsVisible(true);
        setUserStatus('');
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="p-6 flex items-center justify-center min-h-screen">
            {userProfile ? (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
                            <div className="mr-6">
                                <p className="block text-xl font-medium text-blue-800 mb-2">Foto</p>
                                {profileImage ? (
                                    <img src={profileImage} alt="Perfil" className="w-32 h-32 object-cover" />
                                ) : (
                                    <div className="w-32 h-32 flex items-center justify-center rounded border border-gray-300 bg-gray-100 text-gray-500">
                                        <p>No tiene foto</p>
                                    </div>
                                )}
                            </div>
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
                            <div className="mt-4">
                                <p className="block text-xl font-medium text-blue-800">Estado Actual</p>
                                <span
                                    className={`inline-block px-2 py-1 ${getColorByStatus(userStatus)} text-white rounded-full`}
                                >
                                    {userStatus}
                                </span>
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
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="border rounded-lg p-6 shadow-lg bg-white flex flex-col items-center">
                        {/* Mostrar el ícono de QR más grande y centrado */}
                        {!isScanning && (
                            <QrCodeScanner style={{ fontSize: '200px', color: '#1976d2', marginBottom: '5px' }} />
                        )}
                        <video ref={videoRef} style={{ width: '100%', maxWidth: '500px', height: 'auto' }}></video>
                        <div className="mt-4 flex flex-col items-center text-center">
                            {isScanning ? (
                                <Button variant="outlined" color="error" onClick={stopScanning}>
                                    Detener Escaneo
                                </Button>
                            ) : (
                                <Button variant="outlined" color="primary" onClick={startScanning}>
                                    Iniciar Escaneo
                                </Button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: isScanning ? 'none' : 'block', marginTop: '16px' }}
                            />
                        </div>
                    </div>
                </div>
            )}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default InicioPage;
