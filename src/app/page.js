"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button, Typography } from '@mui/material';

export default function Home() {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.replace('/login'); // Redirige a la página de login
    };

    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center text-white">
            {/* Imagen de fondo */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="http://localhost:3300/api/static/images/fondos.jpeg" // URL de la imagen de fondo
                    alt="Fondo"
                    layout="fill"
                    objectFit="cover"
                />
            </div>

            {/* Capa semitransparente para mejorar la visibilidad del texto */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full mt-16">
                {/* Título */}
                <Typography
                    variant="h1"
                    className="text-4xl md:text-6xl font-bold mb-8 text-center"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }} // Sombra para mejorar la visibilidad
                >
                    Control de Acceso al Campus Universitario
                </Typography>

                {/* Botón para redirigir al login */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleLoginRedirect}
                >
                    Ir al Login
                </Button>
            </div>
        </div>
    );
}
