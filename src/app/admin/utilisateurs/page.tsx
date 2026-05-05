"use client";

import React, { useState } from "react";
import { UserList } from "@/features/admin/components/UserList";
import { UserAdminForm } from "@/features/admin/components/UserAdminForm";
import { UserEditForm } from "@/features/admin/components/UserEditForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authService } from "@/features/auth/services/authService";
import { User } from "@/features/auth/types";

export default function AdminUsersPage() {

    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';
    useEffect(() => {
        checkAuth()
    }, []);

    const checkAuth = async () => {
        try {
            const user = await authService.checkAuth();
            setUser(user);
            if (user.role !== "Admin") {
                authService.logout();
                router.push(login);
            }
        } catch (err) {
            authService.logout();
            router.push(login);
        }
        finally {
            setLoading(false);
        }
        // Note: setLoading(false) est géré dans le finally de fetchEvents pour ne pas masquer le contenu
    };

    // Pendant le chargement, on n'affiche rien pour éviter le flash
    if (loading) {
        return (
            <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            </header>
        )
    }

    // Guard express : Seul l'ADMIN peut voir cette page
    if (user && user.role !== "Admin") {
        router.push("/dashboard");
        return null;
    }

    if (!user) return null;

    const handleSuccess = () => {
        setShowForm(false);
        setUserToEdit(null);
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">Administration</span>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Gestion des Utilisateurs</h1>
                </div>
            </div>

            {showForm ? (
                <div className="flex justify-center py-10">
                    <UserAdminForm
                        onSuccess={handleSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            ) : userToEdit ? (
                <div className="flex justify-center py-10">
                    <UserEditForm
                        user={userToEdit}
                        onSuccess={handleSuccess}
                        onCancel={() => setUserToEdit(null)}
                    />
                </div>
            ) : (
                <UserList
                    refreshKey={refreshKey}
                    onAddUser={() => setShowForm(true)}
                    onEditUser={(u) => setUserToEdit(u)}
                />
            )}
        </div>
    );
}
