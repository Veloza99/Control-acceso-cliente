export const navbarItems = [
    {
        title: "Perfil",
        description: "Maneja tu informacion",
        icon: "perfil_icon",
        roles: ["admin", "docente", "estudiante", "vigilante", "administrativo"],
        link: "/dashboard/perfil"
    },
    {
        title: "Inicio QR",
        description: "Revisa tu informacion",
        icon: "inicio_icon",
        roles: ["admin", "docente", "estudiante"],
        link: "/dashboard/inicio"
    },
    {
        title: "Escáner",
        description: "Escanea QR",
        icon: "scan_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/scanner"
    },
    {
        title: "Visitantes",
        description: "Maneja tu informacion",
        icon: "visitor_icon",
        roles: ["admin","vigilante"],
        link: "/dashboard/visitante"
    },
    {
        title: "Usuarios",
        description: "Gestion de usuarios",
        icon: "usuarios_icon",
        roles: ["admin"],
        link: "/dashboard/usuarios"
    },
    {
        title: "Historial por fecha",
        description: "Historico por fecha",
        icon: "entradas_salidas_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/historial-fecha"
    },
    {
        title: "Historial Entradas",
        description: "Historico de acceso",
        icon: "entradas_salidas_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/historial"
    },
    {
        title: "Historial visitantes",
        description: "Historico de visitantes",
        icon: "entradas_salidas_visitor_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/historialVisitantes"
    },
    {
        title: "Cerrar Sesion",
        description: "",
        icon: "logout_icon",
        roles: ["admin", "estudiante", "administrativo"],
        link: "/logout"
    },
];