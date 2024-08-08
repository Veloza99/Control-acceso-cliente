'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import api from '../../api/apiInterceptor';
import { createUserSchema, updateUserSchema } from '@/validation/userValidator';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(editMode ? updateUserSchema : createUserSchema),
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/user');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const onSubmit = async data => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'picProfile') {
                if (data[key] && data[key].length > 0) {
                    formData.append(key, data[key][0]);
                }
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            if (editMode) {
                await api.put(`/user/${currentUserId}`, formData);
            } else {
                await api.post('/user', formData);
            }
            reset();
            await fetchUsers();
            setEditMode(false);
            setCurrentUserId(null);
        } catch (error) {
            console.error('Error submitting user data:', error);
        }
    };

    const handleEdit = user => {
        setEditMode(true);
        setCurrentUserId(user._id);
        reset(user);
    };

    const handleDelete = async userId => {
        try {
            await api.delete(`/user/${userId}`);
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        {...register('firstName')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="First Name"
                    />
                    {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        {...register('lastName')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Last Name"
                    />
                    {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identificacion">Identification</label>
                    <input
                        type="text"
                        {...register('identificacion')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.identificacion ? 'border-red-500' : ''}`}
                        placeholder="Identification"
                    />
                    {errors.identificacion && <p className="text-red-500 text-xs italic">{errors.identificacion?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                        placeholder="Email"
                    />
                    {errors.email && <p className="text-red-500 text-xs italic">{errors.email?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Password"
                    />
                    {errors.password && <p className="text-red-500 text-xs italic">{errors.password?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
                    <select
                        {...register('role')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.role ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select Role</option>
                        <option value="ADMIN">Admin</option>
                        <option value="DOCENTE">Docente</option>
                        <option value="ESTUDIANTE">Estudiante</option>
                        <option value="ADMINISTRATIVO">Administrativo</option>
                        <option value="VISITANTE">Visitante</option>
                        <option value="BIBLIOTECARIO">Bibliotecario</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs italic">{errors.role?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="active">Active</label>
                    <select
                        {...register('active')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.active ? 'border-red-500' : ''}`}
                    >
                        <option value="">Seleccione estado</option>
                        <option value="true">Activada</option>
                        <option value="false">Bloqueada</option>
                    </select>
                    {errors.active && <p className="text-red-500 text-xs italic">{errors.active?.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picProfile">Profile Picture</label>
                    <input
                        type="file"
                        {...register('picProfile')}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.picProfile ? 'border-red-500' : ''}`}
                    />
                    {errors.picProfile && <p className="text-red-500 text-xs italic">{errors.picProfile?.message}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        {editMode ? 'Update User' : 'Create User'}
                    </button>
                </div>
            </form>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2 px-4 bg-gray-200">First Name</th>
                    <th className="py-2 px-4 bg-gray-200">Last Name</th>
                    <th className="py-2 px-4 bg-gray-200">Identification</th>
                    <th className="py-2 px-4 bg-gray-200">Email</th>
                    <th className="py-2 px-4 bg-gray-200">Role</th>
                    <th className="py-2 px-4 bg-gray-200">Active</th>
                    <th className="py-2 px-4 bg-gray-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td className="border px-4 py-2">{user.firstName}</td>
                        <td className="border px-4 py-2">{user.lastName}</td>
                        <td className="border px-4 py-2">{user.identificacion}</td>
                        <td className="border px-4 py-2">{user.email}</td>
                        <td className="border px-4 py-2">{user.role}</td>
                        <td className="border px-4 py-2">{user.active ? 'Active' : 'Inactive'}</td>
                        <td className="border px-4 py-2">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleEdit(user)}>Edit</button>
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(user._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
