"use client";

import React from 'react';
import { useGeneral } from '@/context/GeneralContext';

const PerfilPage = () => {
    const { user } = useGeneral();

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xl font-medium text-blue-800">Nombre</label>
                        <p className="mt-1 text-lg text-gray-700">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                        <label className="block text-xl font-medium text-blue-800">Identificacion</label>
                        <p className="mt-1 text-lg text-gray-700">{user.identificacion}</p>
                    </div>
                    <div>
                        <label className="block text-xl font-medium text-blue-800">Correo Electrónico</label>
                        <p className="mt-1 text-lg text-gray-700">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-xl font-medium text-blue-800">Rol</label>
                        <p className="mt-1 text-lg text-gray-700">{user.role.toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilPage;
