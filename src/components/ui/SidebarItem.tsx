"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONSTANTS } from "@/config/constants";

interface SidebarItemProps {
    label: string;
    href: string;
    icon?: React.ReactNode;
    onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ label, href, icon, onClick }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Strict matching as requested: only active if pathname matches exactly
    // On n'applique la logique active que côté client pour éviter le mismatch
    const isActive = mounted && pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ease-in-out border-r-2 ${isActive
                    ? "text-white shadow-sm border-white"
                    : "text-slate-500 hover:text-slate-900 border-transparent hover:bg-slate-50"
                }`}
            style={isActive ? { backgroundColor: APP_CONSTANTS.colors.mesupres } : {}}
        >
            {icon && (
                <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-slate-400"}`}>
                    {icon}
                </span>
            )}
            <span className="flex-1">{label}</span>
            {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-pulse" />
            )}
        </Link>
    );
};
