import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string().email('Ingrese un correo válido').required('El correo requerido'),
    password: yup.string().min(6, 'La contraseña debe tener al menos 8 caracteres').required('La constraseña es requerida'),
});