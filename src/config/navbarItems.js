export const navbarItems = [
    {
        title: "Inicio",
        description: "Revisa tu informacion",
        icon: "inicio_icon",
        roles: ["admin", "docente", "estudiante"],
        link: "/dashboard/inicio"
    },
    {
        title: "Escaner",
        description: "Escanea QR",
        icon: "scan_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/scanner"
    },
    {
        title: "Perfil",
        description: "Maneja tu informacion",
        icon: "perfil_icon",
        roles: ["admin", "docente", "estudiante", "vigilante"],
        link: "/dashboard/perfil"
    },
    {
        title: "Usuarios",
        description: "Gestion de usuarios",
        icon: "usuarios_icon",
        roles: ["admin", "docente", "estudiante"],
        link: "/dashboard/usuarios"
    },
    {
        title: "Historial",
        description: "Historico de acceso",
        icon: "entradas_salidas_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/historial"
    },
    {
        title: "Cerrar Sesion",
        description: "",
        icon: "logout_icon",
        roles: ["admin", "administrativo"],
        link: "/logout"
    },
];