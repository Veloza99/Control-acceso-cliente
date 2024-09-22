"use client";

import React, { useState, useEffect } from 'react';
import {
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import api from '../../../api/apiInterceptor';

const HistoriaFecha = () => {
    const [fecha, setFecha] = useState('');
    const [historial, setHistorial] = useState([]);
    const [historialFiltrado, setHistorialFiltrado] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noEntries, setNoEntries] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        if (!fecha) {
            setSnackbarMessage('Por favor, selecciona una fecha.');
            setOpenSnackbar(true);
            return;
        }

        setLoading(true);
        setError('');
        setNoEntries(false);
        setHistorial([]);
        try {
            // Asegúrate de que la fecha esté en formato YYYY-MM-DD
            const response = await api.get(`/entry/all-entries?fecha=${fecha}`);
            if (response.data.length === 0) {
                setNoEntries(true);
                setSnackbarMessage('No se encontraron entradas para esta fecha.');
                setOpenSnackbar(true);
            } else {
                setHistorial(response.data);
                setHistorialFiltrado(response.data);
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Error al obtener las entradas.');
            }
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

    // Efecto para filtrar el historial según la búsqueda
    useEffect(() => {
        if (searchQuery) {
            const filtered = historial.filter((entry) => {
                const fullName =
                    entry.userId
                        ? `${entry.userId.firstName} ${entry.userId.lastName}`.toLowerCase()
                        : entry.visitorId
                            ? `${entry.visitorId.firstName} ${entry.visitorId.lastName}`.toLowerCase()
                            : '';
                const identification =
                    entry.userId?.identificacion?.toLowerCase() ||
                    entry.visitorId?.documentNumber?.toLowerCase() ||
                    '';
                const type = entry.userId ? 'Usuario' : entry.visitorId ? 'Visitante' : '';

                return (
                    fullName.includes(searchQuery.toLowerCase()) ||
                    identification.includes(searchQuery.toLowerCase()) ||
                    type.toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
            setHistorialFiltrado(filtered);
        } else {
            setHistorialFiltrado(historial);
        }
    }, [searchQuery, historial]);

    return (
        <div className="p-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Historial de Entradas por Fecha
            </Typography>
            <div className="mb-4">
                <TextField
                    label="Selecciona una Fecha"
                    type="date"
                    variant="outlined"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
            {historialFiltrado.length > 0 && (
                <>
                    <TextField
                        label="Buscar en la tabla"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TableContainer component={Paper} className="mt-4">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Identificación</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Hora de Entrada</TableCell>
                                    <TableCell>Hora de Salida</TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {historialFiltrado.map((entry, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {entry.userId
                                                ? `${entry.userId.firstName} ${entry.userId.lastName}`
                                                : entry.visitorId
                                                    ? `${entry.visitorId.firstName} ${entry.visitorId.lastName}`
                                                    : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.userId?.identificacion ||
                                                entry.visitorId?.documentNumber ||
                                                'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.userId ? 'Usuario' : entry.visitorId ? 'Visitante' : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(entry.entryTime || entry.exitTime)}
                                        </TableCell>
                                        <TableCell>
                                            {entry.entryTime ? formatTime(entry.entryTime) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {entry.exitTime ? formatTime(entry.exitTime) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                      <span
                          className={`inline-block px-2 py-1 ${getColorByStatus(
                              entry.status
                          )} text-white rounded-full`}
                      >
                        {entry.status}
                      </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
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

export default HistoriaFecha;
