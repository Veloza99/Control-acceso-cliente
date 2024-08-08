import * as yup from 'yup';

// Validador para crear usuarios
export const createUserSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    identificacion: yup.string().required('Identification is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    role: yup.string().oneOf(['admin', 'docente', 'estudiante', 'administrativo', 'visitante', 'vigilante'], 'Invalid role').required('Role is required'),
    active: yup.boolean().required('Active status is required')
});

// Validador para actualizar usuarios (todos los campos son opcionales)
export const updateUserSchema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string(),
    identificacion: yup.string(),
    email: yup.string().email('Invalid email format'),
    password: yup.string().notRequired(),
    role: yup.string().oneOf(['admin', 'docente', 'estudiante', 'administrativo', 'visitante', 'vigilante'], 'Invalid role'),
    active: yup.boolean().notRequired()
});

