import { useFetchAuth } from "@/hooks/useFetchAuth";
import { ApiRapport } from "../types";
const fetchAuth = useFetchAuth();

export const rapportService = {
    /**
     * Récupère les rapports de l'utilisateur connecté.
     */
    getRapports: async (): Promise<ApiRapport[]> => {
        try {
            // L'appel se fait sur la route interne de Next.js
            const response = await fetchAuth("/api/rapports", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                // Désactiver le cache si vous voulez des données en temps réel
                cache: "no-store"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }
            const responseData = await response.json();
            const data: ApiRapport[] = responseData.data;

            // Tri par date de début décroissante (les plus récents en premier)
            return data;
        } catch (error) {
            throw error;
        }
    },

    getAllRapports: async (idCalendrier?: number): Promise<ApiRapport[]> => {
        if (!idCalendrier || idCalendrier <= 0) throw new Error("ID Calendrier invalide");
        try {
            // L'appel se fait sur la route interne de Next.js
            const response = await fetchAuth(`/api/rapports/calendrier?idCalendrier=${encodeURIComponent(idCalendrier)}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }
            const responseData = await response.json();
            const data: ApiRapport[] = responseData.data;

            // Tri par date de début décroissante (les plus récents en premier)
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Enregistre un nouveau rapport avec la structure ApiRapport.
     */
    saveRapport: async (rapport: ApiRapport): Promise<ApiRapport> => {
        try {
            // L'appel se fait sur la route interne de Next.js
            const response = await fetchAuth("/api/rapports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rapport),
                // Désactiver le cache si vous voulez des données en temps réel
                cache: "no-store"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }
            const responseData = await response.json();
            const data: ApiRapport = responseData.data;

            // Tri par date de début décroissante (les plus récents en premier)
            return data;
        } catch (error) {
            throw error;
        }
    },
    updateRapport: async (id: number, rapport: ApiRapport): Promise<ApiRapport> => {
        try {
            // L'appel se fait sur la route interne de Next.js
            const response = await fetchAuth(`/api/rapports/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rapport),
                cache: "no-store" // désactiver le cache si nécessaire
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }

            const responseData = await response.json();
            const data: ApiRapport = responseData.data.data;

            // Ici on peut trier ou traiter les données si nécessaire
            return data;
        } catch (error) {
            throw error;
        }
    },
    changerValidationRapport: async (idCalendrierUtilisateur: number): Promise<ApiRapport> => {
        try {
            // L'appel se fait sur la route interne de Next.js
            const body = {
                id: idCalendrierUtilisateur
            }
            const response = await fetchAuth("/api/rapports/changerValidation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                // Désactiver le cache si vous voulez des données en temps réel
                cache: "no-store"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }
            const responseData = await response.json();
            const data: ApiRapport = responseData.data;

            // Tri par date de début décroissante (les plus récents en premier)
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère l'historique des modifications d'un rapport.
     */
    getHistorique: async (idUtilisateur: number, idCalendrier: number): Promise<ApiRapport[]> => {
        if (!idCalendrier || idCalendrier <= 0) throw new Error("ID Calendrier invalide");
        try {
            const response = await fetchAuth(`/api/rapports/historique?idUtilisateur=${idUtilisateur}&idCalendrier=${idCalendrier}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store"
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || errorData.error || `Erreur serveur: ${response.status}`;
                throw new Error(message);
            }
            const responseData = await response.json();
            return responseData.data || [];
        } catch (error) {
            throw error;
        }
    },
};