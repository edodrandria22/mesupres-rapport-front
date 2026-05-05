export const APP_CONSTANTS = {
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'ESPA',
    ministryName: process.env.NEXT_PUBLIC_MINISTRY_NAME || 'MESUPRES',
    departmentName: process.env.NEXT_PUBLIC_DEPARTMENT_NAME || 'DSINT',
    departmentFullName: process.env.NEXT_PUBLIC_DEPARTMENT_FULL_NAME || "Direction des Systèmes d'Information et du Numérique Technologique",
    copyright: {
        owner: process.env.NEXT_PUBLIC_COPYRIGHT_OWNER || 'MESUPRES',
        startYear: process.env.NEXT_PUBLIC_COPYRIGHT_YEAR || '2026'
    },
    apiPrefix: '/api',
    colors: {
        mesupres: "#003366", // Bleu Profond MESUPRES
        mesupresLight: "#e6f0ff",
        mesupresHover: "#004080",
    }
};

export const IMAGES = {
    LOGO_MESUPRES: "/img/logo_mesupres.png",
    LOGO_REPOBLIKA: "/img/repoblika.png",
    LOGO_ESPA: "/img/espa.png",
    LOGO_DSINT: "/img/dsint.png",
    ILLUSTRATION_LOGIN: "/img/login_illustration.svg",
};
