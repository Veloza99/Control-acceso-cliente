'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from "@/validation/loginValidator";
import { useGeneral } from "@/context/GeneralContext";
import Image from 'next/image'; // Importa el componente Image de Next.js

const LoginPage = () => {
    const { user, isAuthenticated, login } = useGeneral();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && isAuthenticated) {
            if (user && user.role !== null && user.role !== undefined) {
                switch (user.role) {
                    case "admin":
                        router.push('/dashboard/usuarios');
                        break;
                    case "docente":
                    case "estudiante":
                    case "administrativo":
                        router.push('/dashboard/inicio');
                        break;
                    case "vigilante":
                        router.push('/dashboard/inicio');
                    default:
                        break;
                }
            }
        }
    }, [isAuthenticated, user, router, isMounted]);

    const onSubmit = async (data) => {
        await login(data.email, data.password);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="bg-blue-900 h-screen overflow-hidden flex items-center justify-center">
            <div className="bg-white lg:w-5/12 md:w-6/12 w-10/12 shadow-3xl relative">
                <div className="bg-gray-800 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8">
                    {/* Imagen del logo desde el backend */}
                    <Image
                        src="http://localhost:3300/api/static/images/escudo_unipamplona.jpg" // URL de la imagen del logo
                        alt="Logo"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                </div>
                <form className="p-12 md:p-24" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6 md:mb-8 relative">
                        <div className="relative">
                            <svg className="absolute ml-3" width="24" viewBox="0 0 24 24">
                                <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z" />
                            </svg>
                            <input
                                type="text"
                                {...register('email')}
                                className={`bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Email"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-6 md:mb-8 relative">
                        <div className="relative">
                            <svg className="absolute ml-3" viewBox="0 0 24 24" width="24">
                                <path d="M18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zM8 6c0-2.206 1.794-4 4-4s4 1.794 4 4v3H8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z" />
                            </svg>
                            <input
                                type="password"
                                {...register('password')}
                                className={`bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full ${errors.password ? 'border-red-500' : ''}`}
                                placeholder="Password"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full">
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
};

export default LoginPage;
