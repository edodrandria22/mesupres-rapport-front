"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/features/auth/types";
import { adminService } from "@/features/admin/services/adminService";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    refreshKey: number;
}

export const UserList: React.FC<UserListProps> = ({ onAddUser, onEditUser, refreshKey }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchEntite, setSearchEntite] = useState("");
    const [searchRole, setSearchRole] = useState("");

    const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await adminService.getAllUtilisateurs();
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                console.error("Erreur chargement utilisateurs", error);
            } finally {
                setIsLoading(false);
            }
        };

    // Filtrer les utilisateurs par entité et rôle
    useEffect(() => {
        let filtered = users;
        
        if (searchEntite) {
            filtered = filtered.filter(user => 
                user.entite?.toLowerCase().includes(searchEntite.toLowerCase())
            );
        }
        
        if (searchRole) {
            filtered = filtered.filter(user => 
                user.role?.toLowerCase().includes(searchRole.toLowerCase())
            );
        }
        
        setFilteredUsers(filtered);
    }, [users, searchEntite, searchRole]);

    useEffect(() => {
        fetchUsers();
    }, [refreshKey]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Comptes Utilisateurs</h2>
                    <p className="text-sm text-slate-500 mt-1">Liste des agents et administrateurs enregistrés.</p>
                </div>
                <button
                    onClick={onAddUser}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Ajouter un utilisateur
                </button>
            </div>

            {/* Filtres de recherche */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Filtres de recherche</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Entité</label>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchEntite}
                                onChange={(e) => setSearchEntite(e.target.value)}
                                placeholder="Rechercher une entité..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Rôle</label>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <select
                                value={searchRole}
                                onChange={(e) => setSearchRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Tous les rôles</option>
                                <option value="Utilisateur">Utilisateur</option>
                                <option value="Admin">Admin</option>
                                <option value="Supervisor">Supervisor</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {(searchEntite || searchRole) && (
                    <button
                        onClick={() => {
                            setSearchEntite("");
                            setSearchRole("");
                        }}
                        className="mt-4 text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Réinitialiser les filtres
                    </button>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Entite</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Email</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Rôle</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px]">Email Copie</th>
                                <th className="px-6 py-4 font-bold text-slate-900 uppercase tracking-widest text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-0">
                                        <AppTableSkeleton rows={8} cols={4} className="border-0 shadow-none rounded-none" />
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-slate-900">{user.entite}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'Utilisateur' ? 'bg-purple-50 text-purple-700' :
                                                    user.role === 'Admin' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {user.emailCopie || ''}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onEditUser(user)}
                                                className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                                                title="Modifier l'utilisateur"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
