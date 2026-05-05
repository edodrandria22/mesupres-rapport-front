"use client";

import React, { useState } from "react";
import { Sidebar } from "../ui/Sidebar";
import { Navbar } from "../ui/Navbar";
import { useUser } from "@/features/auth/contexts/UserContext";
import { APP_CONSTANTS } from "@/config/constants";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useUser();
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex min-h-screen bg-white font-sans selection:bg-black selection:text-white">
            {/* Sidebar fixe — desktop only */}
            <div className="hidden lg:block w-[260px] flex-shrink-0">
                <Sidebar key={user?.id || 'guest'} />
            </div>

            {/* === MOBILE OVERLAY SIDEBAR === */}
            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* Sidebar drawer */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[240px] flex-shrink-0 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <Sidebar key={user?.id || 'guest'} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header with burger button */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span className="text-[11px] font-bold text-slate-900 tracking-[0.2em] uppercase">Rapport d&apos;Activités</span>
                </div>

                <Navbar />

                <div className="flex-1 relative flex flex-col">
                    <main className="flex-1 p-6 lg:p-10 w-full max-w-7xl mx-auto">
                        {children}
                    </main>

                    {/* Footer Centralisé */}
                    <footer className="py-10 px-10 border-t border-slate-100 mt-16">
                        <div className="flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto w-full text-center">
                            {/* Changement en text-slate-900 pour le noir et text-center */}
                            <p className="text-[9px] text-slate-900 font-semibold uppercase tracking-[0.2em]">
                                © {currentYear} — <span className="text-black">{APP_CONSTANTS.departmentName}</span> — {APP_CONSTANTS.ministryName}
                            </p>
                            
                            <div className="flex items-center justify-center gap-6">
                                <span className="text-[9px] text-slate-900 font-medium uppercase tracking-widest whitespace-nowrap italic">
                                    {/* Ton texte optionnel ici */}
                                </span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};
