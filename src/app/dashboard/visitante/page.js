'use client';
import { useState } from 'react';
import { Typography, Button, Snackbar, Alert, TextField } from '@mui/material';
import api from '../../../api/apiInterceptor';

const VisitorForm = () => {
    const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para manejar el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Estado para el mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Estado para el tipo de mensaje del Snackbar

    const [showForm, setShowForm] = useState(false);
    const [showEntryForm, setShowEntryForm] = useState(false); // Estado para mostrar el formulario de entrada
    const [visitorData, setVisitorData] = useState({
        firstName: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        birthDate: '',
        gender: '',
        motivoVisita: ''
    });
    const [entryDocumentNumber, setEntryDocumentNumber] = useState(''); // Estado para el número de documento de entrada
    const [motivoVisita, setMotivoVisita] = useState(''); // Estado para el número de documento de entrada


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setVisitorData({
            ...visitorData,
            [e.target.name]: e.target.value,
        });
    };

    const handleEntryChange = (e) => {
        setEntryDocumentNumber(e.target.value);
    };

    const handleMotivoChange = (e) => {
        setMotivoVisita(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post(`/visitor/register`, visitorData);
            setSuccess('Información del visitante guardada correctamente!');
            setSnackbarMessage('Información del visitante guardada correctamente!');
            setSnackbarSeverity('success'); // Tipo de mensaje para éxito
        } catch (err) {
            console.error('Error guardando la información del visitante:', err);
            setError('Falló el guardado de la información del visitante.');
            setSnackbarMessage('Falló el guardado de la información del visitante.');
            setSnackbarSeverity('warning'); // Tipo de mensaje para advertencia
        } finally {
            setIsLoading(false);
            setOpenSnackbar(true); // Mostrar el Snackbar
        }
    };

    const createEntry = async () => {
        if (entryDocumentNumber) {
            try {
                await api.post(`/entry/visitor-entry`, { documentNumber: entryDocumentNumber });
                setSnackbarMessage('Entrada del visitante creada correctamente!');
                setSnackbarSeverity('success'); // Tipo de mensaje para éxito
            } catch (err) {
                console.error('Error creando la entrada del visitante:', err);
                setSnackbarMessage('Falló la creación de la entrada del visitante.');
                setSnackbarSeverity('warning'); // Tipo de mensaje para advertencia
            } finally {
                setOpenSnackbar(true); // Mostrar el Snackbar
            }
        } else {
            setSnackbarMessage('Por favor, ingrese el número de documento del visitante.');
            setSnackbarSeverity('warning'); // Tipo de mensaje para advertencia
            setOpenSnackbar(true); // Mostrar el Snackbar
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Gestión de Visitantes</h2>
            <div className="mb-6">
                <button
                    onClick={() => setShowEntryForm(!showEntryForm)}
                    className="w-full bg-blue-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none"
                >
                    {showEntryForm ? 'Ocultar Formulario de Entrada' : 'Crear Entrada del Visitante'}
                </button>
            </div>
            {showEntryForm && (
                <div className="mb-6">
                    <TextField
                        label="Número de Documento"
                        variant="outlined"
                        value={entryDocumentNumber}
                        onChange={handleEntryChange}
                        className="w-full mb-4"
                    />
                    <TextField
                        label="Motivo Visita"
                        variant="outlined"
                        value={motivoVisita}
                        onChange={handleMotivoChange}
                        required
                        className="w-full mb-4"

                    />
                    <button
                        onClick={createEntry}
                        className="w-full bg-blue-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none"
                    >
                        Crear Entrada
                    </button>
                </div>
            )}
            <div className="mb-6">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full bg-green-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 focus:outline-none"
                >
                    {showForm ? 'Ocultar Formulario' : 'Crear Visitante'}
                </button>
            </div>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="firstName"
                                   className="block text-xl font-medium text-blue-800">Nombres</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={visitorData.firstName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName"
                                   className="block text-xl font-medium text-blue-800">Apellidos</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={visitorData.lastName}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="documentType" className="block text-xl font-medium text-blue-800">Tipo de
                                Documento</label>
                            <select
                                id="documentType"
                                name="documentType"
                                value={visitorData.documentType}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Selecciona tipo de documento</option>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="PSS">Pasaporte</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="documentNumber" className="block text-xl font-medium text-blue-800">Número
                                de Documento</label>
                            <input
                                type="text"
                                id="documentNumber"
                                name="documentNumber"
                                value={visitorData.documentNumber}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="birthDate" className="block text-xl font-medium text-blue-800">Fecha de
                                Nacimiento</label>
                            <input
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                value={visitorData.birthDate}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-xl font-medium text-blue-800">Género</label>
                            <select
                                id="gender"
                                name="gender"
                                value={visitorData.gender}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            >
                                <option value=""></option>
                                <option value="Male">Masculino</option>
                                <option value="Female">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="motivoVisita"
                                   className="block text-xl font-medium text-blue-800">Motivo Visita</label>
                            <input
                                type="text"
                                id="motivoVisita"
                                name="motivoVisita"
                                value={visitorData.motivoVisita}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full px-4 py-2 border border-blue-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-blue-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enviando...' : 'Registrar Visitante'}
                        </button>
                    </div>
                </form>
            )}
            {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
            {success && <p className="mt-4 text-green-600 text-center">{success}</p>}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posición en la parte superior derecha
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default VisitorForm;
