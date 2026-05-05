"use client";

import React, { useEffect, useState } from "react";
import { roleService, Role } from "../services/roleService";
import toast from "react-hot-toast";

interface RoleSelectProps {
    value?: string | number;
    onChange: (value: string) => void;
    error?: string;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({ value, onChange, error }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await roleService.getAllRoles();
                setRoles(data);
            } catch (err) {
                toast.error("Erreur chargement rôles");
                // console.error("Erreur chargement rôles", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoles();
    }, []);

    return (
        <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Rôle</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded text-sm text-slate-900 bg-white outline-none focus:ring-1 focus:ring-slate-900 appearance-none transition-colors ${error ? "border-red-500" : "border-slate-300"
                        }`}
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2394a3b8\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '0.8em'
                    }}
                >
                    <option value="">Choisir un rôle...</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.nom}
                        </option>
                    ))}
                </select>
                {isLoading && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                        <div className="h-3 w-3 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            {error && <p className="text-[10px] text-red-600 font-bold">{error}</p>}
        </div>
    );
};
