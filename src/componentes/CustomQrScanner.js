import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

const CustomQrScanner = ({ onError, onScan, style = { width: '100%' } }) => {
    const videoRef = useRef(null);
    const qrScannerRef = useRef(null);
    const [statusMessage, setStatusMessage] = useState('Código no encontrado');

    useEffect(() => {
        if (videoRef.current) {
            qrScannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    if (result) {
                        onScan(result);
                        qrScannerRef.current.stop(); // Detener el escaneo después de encontrar un QR válido
                    } else {
                        setStatusMessage('Código no encontrado');
                    }
                },
                {
                    highlightScanRegion: true, // Resaltar la región de escaneo
                    returnDetailedScanResult: true, // Devuelve resultados detallados del escaneo
                }
            );

            qrScannerRef.current.start().catch((error) => {
                console.error('Error al iniciar la cámara:', error);
                setStatusMessage('Error al iniciar la cámara');
                if (onError) {
                    onError(error);
                }
            });
        }

        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
            }
        };
    }, [onScan, onError]);

    return (
        <div style={{ position: 'relative', ...style }}>
            <video ref={videoRef} style={{ width: '100%' }}></video>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    fontSize: '1.5em',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            >
                {statusMessage}
            </div>
        </div>
    );
};

export default CustomQrScanner;
