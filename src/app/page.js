"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGeneral } from '@/context/GeneralContext';

export default function Home() {
    const router = useRouter();
    const { user } = useGeneral();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            const userRole = user?.role;
            console.log('rol: ' + userRole);
            if (userRole) {
                switch (userRole) {
                    case 'admin':
                        router.replace('/dashboard/scanner');
                        break;
                    case 'vigilante':
                        router.replace('/dashboard/scanner');
                        break;
                    case 'usuario':
                        router.replace('/dashboard/usuario');
                        break;
                    default:
                        router.replace('/dashboard/inicio');
                        break;
                }
            }
        } else {
            router.replace('/login');
        }
    });

    return null;
}
