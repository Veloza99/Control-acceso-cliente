"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../../api/apiInterceptor'; // Asegúrate de configurar correctamente tu instancia de API
import { format } from 'date-fns'; // Importar date-fns para formatear fechas

const VisitorHistoryPage = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/entry/visitor-all-entries');
            const today = new Date().toISOString().split('T')[0]; // Obtener la fecha de hoy en formato 'YYYY-MM-DD'
            const filteredEntries = response.data.filter(entry => entry.entryTime.startsWith(today)); // Filtrar solo las entradas del día de hoy
            setEntries(filteredEntries);
        } catch (err) {
            console.error('Error fetching entries:', err);
            setError('Error fetching entries.');
        } finally {
            setLoading(false);
        }
    };

    const handleExit = async (documentNumber) => {
        try {
            await api.post('/entry/visitor-exit', { documentNumber });
            setSnackbarMessage('Salida registrada exitosamente.');
            setOpenSnackbar(true);
            fetchEntries(); // Refrescar la lista de entradas
        } catch (err) {
            console.error('Error registering exit:', err);
            setSnackbarMessage('Error registrando salida.');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const formatTime = (dateTime) => {
        const time = new Date(dateTime);
        return format(time, 'HH:mm'); // Mostrar solo la hora en formato 24 horas
    };

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Historial de Visitantes
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {error && <p className="text-red-500">{error}</p>}
                    <TableContainer component={Paper} className="mt-4">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Tipo de Documento</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell>Hora de Entrada</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Salida</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((entry) => (
                                    <TableRow key={entry.visitorId}>
                                        <TableCell>{entry.visitor.firstName} {entry.visitor.lastName}</TableCell>
                                        <TableCell>{entry.visitor.documentType}</TableCell>
                                        <TableCell>{entry.visitor.documentNumber}</TableCell>
                                        <TableCell>{formatTime(entry.entryTime)}</TableCell>
                                        <TableCell>{entry.status}</TableCell>
                                        <TableCell>
                                            {entry.status === 'Pendiente de salida' && (
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleExit(entry.visitor.documentNumber)}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Error') ? 'warning' : 'success'} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default VisitorHistoryPage;
