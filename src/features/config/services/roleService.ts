import { useFetchAuth } from "@/hooks/useFetchAuth";

export interface Role {
    id: string;
    nom: string;
}

const fetchAuth = useFetchAuth();

export const roleService = {
    /**
     * Récupère la liste des rôles depuis le backend via le proxy Next.js.
     */
    getAllRoles: async (): Promise<Role[]> => {
        try {
            const response = await fetchAuth("/api/roles", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.data || responseData;
        } catch (error) {
            throw error;
        }
    }
};
