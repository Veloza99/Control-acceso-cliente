export const navbarItems = [
    {
        title: "Inicio",
        description: "Revisa tu informacion",
        icon: "inicio_icon",
        roles: ["admin", "docente", "estudiante"],
        link: "/dashboard"
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
        title: "Entradas y Salidas",
        description: "Control de acceso",
        icon: "entradas_salidas_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/controldeacceso"
    },
    {
        title: "Horarios",
        description: "Gestión de horarios y programación de eventos",
        icon: "horarios_icon",
        roles: ["admin", "vigilante"],
        link: "/dashboard/horarios"
    },
    {
        title: "Reportes",
        description: "Generación y visualización de reportes.",
        icon: "reportes_icon",
        roles: ["admin"],
        link: "/dashboard/reportes"
    },
    {
        title: "Configuración",
        description: "Configuración general del sistema y ajustes específicos.",
        icon: "configuracion_icon",
        roles: ["admin"],
        link: "/dashboard/configuracion"
    },
    {
        title: "Administración",
        description: "Gestión de la universidad",
        icon: "administracion_icon",
        roles: ["admin", "administrativo"],
        link: "/dashboard/administracion"
    },
    {
        title: "Estudiante",
        description: "Gestión de estudiante",
        icon: "administracion_icon",
        roles: ["admin", "administrativo"],
        link: "/dashboard/estudiante"
    },
    {
        title: "Cerrar Sesion",
        description: "",
        icon: "logout_icon",
        roles: ["admin", "administrativo"],
        link: "/logout"
    },
];