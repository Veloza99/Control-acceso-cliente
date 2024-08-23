"use client";

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Typography } from '@mui/material';
import { useGeneral } from '@/context/GeneralContext';

const InicioPage = () => {
    const { user } = useGeneral();
    const [qrCodeData, setQrCodeData] = useState('');

    useEffect(() => {
        if (user) {
            // Genera el QR con la información del usuario
            const userInfo = JSON.stringify({
                identificacion: user.identificacion,
            });
            setQrCodeData(userInfo);
        }
    }, [user]);

    return (
        <div className="p-6 flex flex-col items-center">
            <Typography variant="h4" component="h1" gutterBottom>
                Mi Código QR
            </Typography>
            <div className="w-full max-w-xs">
                <QRCode value={qrCodeData} size={256} />
            </div>
            <Typography variant="body1" className="mt-4 text-gray-500">
                Este QR contiene tu información para ser escaneado.
            </Typography>
        </div>
    );
};

export default InicioPage;
