"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Button, TextField, CircularProgress, Paper, Snackbar, Alert } from '@mui/material';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { extractColDocumentData } from './extractColDocumentData'; // Ajusta la ruta según tu estructura

const Page = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        idNumber: '',
        lastName1: '',
        lastName2: '',
        firstName1: '',
        middleName: '',
        gender: '',
        birthDate: '',
        bloodType: '',
        municipalityCode: '',
        departmentCode: ''
    });
    const [scanning, setScanning] = useState(true);
    const [videoStream, setVideoStream] = useState(null); // Estado para guardar el flujo de video

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();

        const startScanning = async () => {
            try {
                // Obtener el flujo de video
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream); // Guardar el flujo de video en el estado

                // Iniciar el escaneo
                codeReader.decodeFromVideoDevice(undefined, 'video', (result, error) => {
                    if (result) {
                        try {
                            const extractedData = extractColDocumentData(result.text);
                            setData(extractedData);
                            setFormData(extractedData);
                        } catch (err) {
                            setError('Error extracting data.');
                        }
                    } else if (error instanceof NotFoundException) {
                        console.warn('No QR code found.');
                    } else {
                        setError('Error scanning PDF417 code.');
                    }
                });
            } catch (err) {
                setError('Error accessing camera.');
            }
        };

        if (scanning) {
            startScanning();
        } else {
            // Detener el escaneo y apagar la cámara
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop()); // Detener todas las pistas del flujo de video
                setVideoStream(null);
            }
            codeReader.reset(); // Limpiar el lector
        }

        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop()); // Asegúrate de detener las pistas al desmontar el componente
            }
            codeReader.reset();
        };
    }, [scanning]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario o cualquier otra acción que necesites
        console.log('Formulario enviado:', formData);
    };

    const handleCancelScan = () => {
        setScanning(false); // Detener el escaneo
        setData(null); // Limpiar los datos escaneados
    };

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Escanear Código PDF417
            </Typography>
            <video id="video" style={{ width: '100%', maxWidth: '500px' }}></video>
            {loading && <CircularProgress />}
            {error && <Snackbar open autoHideDuration={6000}><Alert severity="error">{error}</Alert></Snackbar>}
            <Button
                onClick={handleCancelScan}
                variant="contained"
                color="secondary"
                style={{ margin: '16px 0' }}
            >
                Cancelar Escaneo
            </Button>
            <Paper className="p-4 mt-4">
                <Typography variant="h6">Datos Extraídos:</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Número de Identificación"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido 1"
                        name="lastName1"
                        value={formData.lastName1}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Apellido 2"
                        name="lastName2"
                        value={formData.lastName2}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Nombre 1"
                        name="firstName1"
                        value={formData.firstName1}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Nombre 2"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Género"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Fecha de Nacimiento"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Tipo de Sangre"
                        name="bloodType"
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Código Municipal"
                        name="municipalityCode"
                        value={formData.municipalityCode}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Código de Departamento"
                        name="departmentCode"
                        value={formData.departmentCode}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Enviar
                    </Button>
                </form>
            </Paper>
        </div>
    );
};

export default Page;
