"use client";

import React from 'react';
import { useGeneral } from '@/context/GeneralContext';

const PerfilPage = () => {
    const { user, getImagenPerfil } = useGeneral();

    // Función para obtener la URL de la imagen de perfil
    const getProfileImage = async () => {
        if (user && user.picProfile) {
            return await getImagenPerfil(user.picProfile);
        }
        return null;
    };

    // Obtener la imagen de perfil
    const [profileImage, setProfileImage] = React.useState(null);
    React.useEffect(() => {
        const fetchProfileImage = async () => {
            const image = await getProfileImage();
            setProfileImage(image);
        };
        fetchProfileImage();
    }, [user, getImagenPerfil]);

    if (!user) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Perfil del Usuario</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 mr-6">
                        <p className="block text-xl font-medium text-blue-800">Foto</p>
                        {profileImage ? (
                            <img src={profileImage} alt="Perfil" className="w-32 h-32 rounded-full" />
                        ) : (
                            <div className="w-38 h-38 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-gray-500">
                                <p>No tiene foto</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <label className="block text-xl font-medium text-blue-800">Nombre</label>
                            <p className="mt-1 text-lg text-gray-700">{user.firstName} {user.lastName}</p>
                        </div>
                        <div>
                            <label className="block text-xl font-medium text-blue-800">Identificación</label>
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
        </div>
    );
};

export default PerfilPage;
