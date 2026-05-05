"use client";

import React, { useEffect, useState } from "react";
import { SupervisionView } from "@/features/rapports/components/vision/SupervisionView";
import { User } from "@/features/auth/types";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/authService";
/**
 * Page Supervision — accessible uniquement aux ADMIN et MANAGER.
 * Redirige les utilisateurs standards vers /dashboard/nouveau.
 */
export default function SupervisionPage() {
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
                if (user.role !== "Admin" && user.role !== "Supervisor") {
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
    return (
        <div className="space-y-6">
            <SupervisionView />
        </div>
    );
}
