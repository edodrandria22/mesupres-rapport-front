
import { LoginRequest, AuthResponse, Entite, User } from "../types";

const API_URL = '/api/auth';
/**
 * Service d'authentification (mock statique).
 */
export const authService = {
    
    /**
     * Récupère la liste des entités disponibles (simulé).
     */
    checkAuth: async (): Promise<User> => {
        const response = await fetch(`/api/auth/me`, {
            method: "GET",
            credentials: "include", // <--- C'est cette ligne qui manque !
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de la connexion');
        }
        
        return data.user as User;
    },
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            // On extrait le message d'erreur du backend s'il existe
            throw new Error(data.message || data.error || 'Erreur lors de la connexion');
        }

        return data as AuthResponse;
    },

    logout: async (): Promise<void> => {
        await fetch(`/api/auth/logout`, { method: 'POST' });
        await new Promise((resolve) => setTimeout(resolve, 300));
    },
};
