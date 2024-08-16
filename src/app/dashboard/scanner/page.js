"use client";

import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Typography } from '@mui/material';

const InicioPage = () => {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
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
    }, []);

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Scanear QR
            </Typography>
            {scanResult ? (
                <div>
                    <Typography variant="body1">
                        Success: <a href={scanResult}>{scanResult}</a>
                    </Typography>
                </div>
            ) : (
                <div>
                    <div id="reader" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}></div>
                    <Typography variant="body1" className="mt-4">
                        Escanea el codigo QR.
                    </Typography>
                </div>
            )}
        </div>
    );
};

export default InicioPage;
