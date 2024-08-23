"use client";

import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import api from '../../../api/apiInterceptor'; // Asegúrate de configurar correctamente tu instancia de API

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
            setEntries(response.data);
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
                                        <TableCell>{new Date(entry.entryTime).toLocaleString()}</TableCell>
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
