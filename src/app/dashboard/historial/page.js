"use client";

import React, { useState } from 'react';
import { Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import api from '../../../api/apiInterceptor'; // Asegúrate de que la ruta sea correcta

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

    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
    };
    const formatTime = (dateString) => {
        return dateString ? new Date(dateString).toLocaleTimeString() : 'N/A';
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
                            {historial.map((entry, index) => {
                                // Usar entry.entryTime si existe, de lo contrario entry.exitTime
                                const date = entry.entryTime ? formatDate(entry.entryTime) : (entry.exitTime ? formatDate(entry.exitTime) : 'N/A');
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{date}</TableCell>
                                        <TableCell>{formatTime(entry.entryTime)}</TableCell>
                                        <TableCell>{formatTime(entry.exitTime)}</TableCell>
                                        <TableCell>{entry.status}</TableCell>
                                    </TableRow>
                                );
                            })}
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
