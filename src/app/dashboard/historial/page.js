"use client";

import React, { useState } from 'react';
import { Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import api from '../../../api/apiInterceptor';

const HistorialPage = () => {
    const [identificacion, setIdentificacion] = useState('');
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noEntries, setNoEntries] = useState(false); // Estado para manejar mensaje de no entradas
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setNoEntries(false); // Resetear mensaje de no entradas
        setHistorial([]); // Limpiar historial previo
        try {
            const response = await api.get(`/entry/all/${identificacion}`);
            if (response.data.length === 0) {
                setNoEntries(true);
                setSnackbarMessage('No se encontraron entradas para esta identificación.');
                setOpenSnackbar(true);
            } else {
                setHistorial(response.data);
            }
        } catch (error) {
            console.error('Error fetching entry history:', error);
            setError('Error fetching entry history.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const getColorByStatus = (status) => {
        switch (status) {
            case 'Pendiente de salida':
                return 'bg-orange-500';
            case 'Exitoso':
                return 'bg-green-500';
            case 'Sin entrada':
            case 'Sin salida':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleDateString();
    };

    const formatTime = (dateTime) => {
        const time = new Date(dateTime);
        return time.toLocaleTimeString();
    };

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Historial de Entradas
            </Typography>
            <div className="mb-4">
                <TextField
                    label="Identificación del Usuario"
                    variant="outlined"
                    value={identificacion}
                    onChange={(e) => setIdentificacion(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    style={{ marginTop: '1rem' }}
                >
                    Buscar
                </Button>
            </div>
            {loading && <CircularProgress />}
            {error && <p className="text-red-500">{error}</p>}
            {historial.length > 0 && (
                <TableContainer component={Paper} className="mt-4">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora de Entrada</TableCell>
                                <TableCell>Hora de Salida</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historial.map((entry, index) => (
                                <TableRow key={index}>
                                    <TableCell>{formatDate(entry.entryTime || entry.exitTime)}</TableCell>
                                    <TableCell>{entry.entryTime ? formatTime(entry.entryTime) : 'N/A'}</TableCell>
                                    <TableCell>{entry.exitTime ? formatTime(entry.exitTime) : 'N/A'}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-block px-2 py-1 ${getColorByStatus(entry.status)} text-white rounded-full`}
                                        >
                                            {entry.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            {/* Snackbar para mensajes */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default HistorialPage;
