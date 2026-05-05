"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useUser } from "@/features/auth/contexts/UserContext";
import { APP_CONSTANTS, IMAGES } from "@/config/constants";
import { SidebarItem } from "./SidebarItem";
import Link from "next/link";

interface MenuItem {
    label: string;
    href: string;
    roles: string[];
    section: "Navigation" | "Pilotage" | "Administration";
    icon?: React.ReactNode;
}

const ALL_LINKS: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", roles: ["Admin", "Utilisateur", "Supervisor"], section: "Navigation" },
    { label: "Nouveau", href: "/dashboard/nouveau", roles: ["Admin", "Utilisateur", "Supervisor"], section: "Navigation" },
    { label: "Supervision", href: "/supervision", roles: ["Admin", "Supervisor"], section: "Pilotage" },
    { label: "Recherche", href: "/dashboard/rapports/recherche", roles: ["Admin", "Utilisateur", "Supervisor"], section: "Navigation",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
    },
    { label: "Stats", href: "/supervision/dashboard", roles: ["Admin","Supervisor"], section: "Pilotage" },
    { label: "Périodes", href: "/supervision/periodes", roles: ["Admin", "Supervisor"], section: "Pilotage" },
    {
        label: "Utilisateurs",
        href: "/admin/utilisateurs",
        roles: ["Admin"],
        section: "Administration",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    },
];

export const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filtrage dynamique des liens via useMemo
    const menuItems = useMemo(() => {
        if (!user) return [];
        return ALL_LINKS.filter(link => link.roles.includes(user.role));
    }, [user]);

    const renderSection = (section: MenuItem["section"], title: string) => {
        const items = menuItems.filter(item => item.section === section);
        if (items.length === 0) return null;

        return (
            <div className={section !== "Navigation" ? "mt-8" : "mb-2"}>
                <div className="px-8 mb-3">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">{title}</span>
                </div>
                {items.map(item => (
                    <SidebarItem
                        key={item.href}
                        label={item.label}
                        href={item.href}
                        icon={item.icon}
                        onClick={onClose}
                    />
                ))}
            </div>
        );
    };

    if (!mounted) {
        return (
            <aside className="w-[240px] h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 z-50">
                <div className="px-8 py-10 flex flex-col items-center text-center gap-6">
                    <div className="h-16 w-16 bg-slate-50 flex items-center justify-center rounded-lg animate-pulse" />
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-[240px] h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 z-50 transition-all shadow-sm">
            {/* Mobile close button */}
            {onClose && (
                <div className="flex justify-end px-4 pt-4 lg:hidden">
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="px-8 py-10 flex flex-col items-center text-center gap-6">
                <img
                    src={IMAGES.LOGO_MESUPRES}
                    alt={`Logo ${APP_CONSTANTS.ministryName}`}
                    className="h-16 w-auto mix-blend-multiply object-contain transition-transform hover:scale-105 duration-300"
                />
                <div className="space-y-2">
                    <h1 className="text-[11px] font-bold text-slate-900 tracking-[0.25em] uppercase leading-tight">
                        Rapport d&apos;Activités
                    </h1>
                    <div className="h-[1px] w-8 bg-slate-100 mx-auto" />
                    {/* <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                        {APP_CONSTANTS.appName} / {APP_CONSTANTS.departmentName}
                    </p> */}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto pt-4 transition-all duration-300">
                {renderSection("Navigation", "Navigation")}
                {renderSection("Pilotage", "Pilotage")}
                {renderSection("Administration", "Administration")}
            </nav>
        </aside>
    );
};