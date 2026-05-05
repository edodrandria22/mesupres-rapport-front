import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/features/auth/contexts/UserContext";
import { APP_CONSTANTS } from "@/config/constants";

/**
 * Barre de navigation épurée.
 */
export const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo / Titre - Clean */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-900 tracking-tight uppercase">Mon Rapport</span>
          <div className="h-3 w-[1px] bg-slate-200"></div>
          {/* <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{APP_CONSTANTS.ministryName}</span> */}
        </Link>

        {/* Profile + Logout - Simple */}
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 py-1.5 px-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all active:scale-95 group"
          >
            <div className="h-6 w-6 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm uppercase">
              {user?.entite?.substring(0, 2) || "U"}
            </div>
            <div className="flex flex-col items-start mr-1">
              <span className="text-[10px] font-bold text-slate-900 uppercase leading-none">Mon Compte</span>
              <span className="text-[8px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">Paramètres</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-50 mb-1 bg-slate-50/50">
                <p className="text-[10px] font-medium text-slate-900 lowercase truncate">{user?.email}</p>
                {/* <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5 lowercase">{user?.email}</p> */}
              </div>

              <Link
                href="/dashboard/profile/security"
                className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="h-7 w-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Changer le mots de passe
              </Link>

              {/* {user?.role === "Admin" && ( */}
                <>
                  <div className="h-[1px] bg-slate-50 my-1 mx-2" />
                  <div className="px-4 py-1.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Administration</p>
                  </div>
                  <Link
                    href="/dashboard/OS"
                    className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Objectifs Spécifiques
                  </Link>
                  <Link
                    href="/dashboard/LI"
                    className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Logiques d'Interventions
                  </Link>
                </>
              {/* )} */}

              <div className="h-[1px] bg-slate-50 my-1 mx-2" />

              <button
                onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-red-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};