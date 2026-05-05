"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { LoginRequest, User } from "../types";
import { useUser } from "../contexts/UserContext";

/**
 * Hook de connexion avec redirection basée sur le rôle.
 */
export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [user, setUserLocal] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const { setUser } = useUser();
    const router = useRouter();

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setIsRedirecting(false);
        setError(null);

        try {
            const response = await authService.login(credentials);

            // Mise à jour de l'état global pour la Sidebar/Navbar
            setUser(response.user);

            // Mise à jour de l'état local pour l'écran de bienvenue
            setUserLocal(response.user);
            setIsRedirecting(true);

            // Redirection après un délai de "courtoisie" pour laisser voir le message de bienvenue
            setTimeout(() => {
                // const isFirstLogin = !response.user.dateValidation;

                // if (isFirstLogin) {
                //     setNotice("Première connexion : Veuillez personnaliser votre mot de passe.");
                //     router.push("/dashboard/profile/security");
                //     return;
                // }

                const role = response.user.role;
                // if (role === "Admin") {
                //     router.push("/admin/supervision");
                // } else {
                    router.push("/dashboard/nouveau");
                // }
            }, 1200);

            return response.user;
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de la connexion.");
            setUser(null);
            setIsRedirecting(false);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, isRedirecting, error, notice, user };
};
