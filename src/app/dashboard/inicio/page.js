"use client";

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Button, Typography } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useGeneral } from '@/context/GeneralContext';

const InicioPage = () => {
    const { user } = useGeneral();
    const [qrCodeData, setQrCodeData] = useState('');
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            // Genera el QR con la información del usuario
            const userInfo = JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                identificacion: user.identificacion,
                email: user.email,
                role: user.role,
                userId: user.userId,
            });
            setQrCodeData(userInfo);
        } else {
            setQrCodeData('');
        }
    }, [user]);

    const handleGenerateVigilanteQR = () => {
        if (user && user.role === 'admin') {
            const vigilanteInfo = JSON.stringify({
                firstName: user.firstName,
                lastName: user.lastName,
                identificacion: user.identificacion,
                email: user.email,
                role: user.role,
                userId: user.userId,
            });
            setQrCodeData(vigilanteInfo);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            const scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
            });

            let isScanning = true;

            scanner.render(success, error);

            function success(result) {
                if (isScanning) {
                    scanner.clear();
                    setScanResult(result);
                    isScanning = false; // Stop further scanning
                }
            }

            function error(err) {
                console.warn(err);
            }

            return () => {
                // Cleanup on unmount
                scanner.clear();
            };
        }
    }, [user]);

    return (
        <div className="p-6">
            {user.role !== 'admin' ? (
                <div className="flex flex-col items-center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Mi Código QR
                    </Typography>
                    <div className="w-full max-w-xs">
                        <QRCode value={qrCodeData} size={256} />
                    </div>
                    <Typography variant="body1" className="mt-4 text-gray-500">
                        Este QR contiene tu información para ser escaneado por un vigilante.
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Panel de Vigilante
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleGenerateVigilanteQR}>
                        Generar Mi QR
                    </Button>
                    <Button variant="outlined" color="secondary" className="mt-4">
                        Escanear QR de Usuario
                    </Button>
                    <div className="mt-4 w-full">
                        <div id="reader" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}></div>
                        {scanResult && (
                            <Typography variant="body1" className="mt-4">
                                Información escaneada: {scanResult}
                            </Typography>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InicioPage;
