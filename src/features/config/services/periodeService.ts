import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";
import { User } from "../../auth/types";
import { useFetchAuth } from "@/hooks/useFetchAuth";


const fetchAuth = useFetchAuth();
export const periodeService = {
    /**
     * Liste les périodes du calendrier depuis le backend Symfony via le proxy Next.js.
     */
    getPeriods: async (dateDebut?: string | null, dateFin?: string | null): Promise<CalendarPeriod[]> => {
        try {
            // 1. Construction dynamique de l'URL avec les paramètres
            const params = new URLSearchParams();
            if (dateDebut) params.append("dateDebut", dateDebut);
            if (dateFin) params.append("dateFin", dateFin);

            // Si des paramètres existent, on ajoute '?' à l'URL
            const queryString = params.toString() ? `?${params.toString()}` : "";
            const url = `/api/calendriers${queryString}`;

            const response = await fetchAuth(url, {
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
    },
    getPeriodsUtilisateur: async (): Promise<CalendarPeriod[]> => {
        try {
            const response = await fetchAuth("/api/calendriers/utilisateur", {
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
            // console.error("Erreur getPeriods:", error);
            throw error;
        }
    },

    /**
     * Ajoute une nouvelle période en appelant le backend via le proxy Next.js.
     */
    createPeriod: async (dateDebut: string, dateFin: string, typeCalendrierId: number): Promise<CalendarPeriod> => {
        try {
            const response = await fetchAuth("/api/calendriers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    dateDebut,
                    dateFin,
                    typeCalendrierId,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData.data || responseData;
        } catch (error) {
            // console.error("Erreur createPeriod:", error);
            throw error;
        }
    },

    /**
     * Met à jour une période existante.
     */
    updateCalendrier: async (id: number, data: { dateDebut: string; dateFin: string; typeCalendrierId: number }): Promise<CalendarPeriod> => {
        try {
            const response = await fetchAuth(`/api/calendriers/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
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
    },

    /**
     * Supprime une période par son ID.
     */
    deleteCalendrier: async (id: number): Promise<void> => {
        try {
            const response = await fetchAuth(`/api/calendriers/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorData.error || `Erreur serveur: ${response.status}`);
            }
        } catch (error) {
            throw error;
        }
    },

    /**
     * Récupère la liste des utilisateurs en retard pour un calendrier donné.
     */
    getLateUsers: async (idCalendrier: number | string): Promise<User[]> => {
        try {
            const response = await fetchAuth(`/api/admin/retard?idCalendrier=${idCalendrier}`, {
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
            // console.error("Erreur getLateUsers:", error);
            throw error;
        }
    },
    getCalendrierSupervision: async (date: string): Promise<CalendarPeriod[]> => {
        try {
            const response = await fetchAuth(`/api/calendriers/supervision?date=${date}`, {
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
            // console.error("Erreur getCalendrierSupervision:", error);
            throw error;
        }
    }
};
