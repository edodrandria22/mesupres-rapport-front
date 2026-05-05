"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
import { User } from "@/features/auth/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminPilotageProvider } from "@/features/admin/context/AdminPilotageContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();
    const login = process.env.NEXT_PUBLIC_LOGIN_URL || '/login';

    useEffect(() => {
        if (!authChecked) {
            checkAuth();
            setAuthChecked(true);
        }
    }, [authChecked]);

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
        } finally {
            setAuthChecked(true);
            setLoading(false);
        }
    };

    // if (loading) {
    //     return (
    //         <header className="h-16 border-b border-border bg-card flex items-center justify-end px-6">
    //             <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    //         </header>
    //     );
    // }

    // if (!user || user.role !== "Admin") {
    //     return null;
    // }

    return (
        <AdminPilotageProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </AdminPilotageProvider>
    );
}
