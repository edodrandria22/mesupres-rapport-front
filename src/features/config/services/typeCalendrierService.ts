import { TypeCalendrier } from "@/features/admin/services/adminService";

export const typeCalendrierService = {
    /**
     * Récupère la liste des types de calendriers depuis l'API Symfony via le proxy Next.js.
     */
    getTypeCalendriers: async (): Promise<TypeCalendrier[]> => {
        try {
            const response = await fetch("/api/type-calendriers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erreur serveur: ${response.status}`);
            }

            const responseData = await response.json();

            // On s'attend à ce que Symfony renvoie les données dans un champ 'data' ou directement
            // Selon BaseApiController, c'est souvent dans 'data'
            const data: TypeCalendrier[] = responseData.data || responseData;

            return data;
        } catch (error) {
            // console.error("Erreur getTypeCalendriers:", error);
            throw error;
        }
    },
};
