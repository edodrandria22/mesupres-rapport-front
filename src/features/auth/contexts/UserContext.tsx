"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserContextType } from "@/features/auth/types";
import { authService } from "@/features/auth/services/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// 1. Déclaration du contexte avec le bon type
const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser doit être utilisé à l'intérieur d'un UserProvider");
    }
    return context;
};

// 2. Le Composant Provider qui gère l'affectation
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        setIsLoading(true);
        try {
            const userData = await authService.checkAuth();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            router.push("/login"); // Force la redirection après le nettoyage de l'état
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
            // console.error("Erreur lors de la déconnexion:", error);
            // On nettoie quand même l'état local au cas où
            setUser(null);
            router.push("/login");
        } finally {
            setIsLoading(false);
        }
    };

    // On garde le useEffect pour le chargement initial
    useEffect(() => {
        fetchUser();
    }, []);

    // On passe l'objet complet au Provider
    const value: UserContextType = {
        user,
        loading: isLoading,
        setUser,
        logout,
        refreshUser: fetchUser,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};