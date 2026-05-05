import { useFetchAuth } from "@/hooks/useFetchAuth";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";

const fetchAuth = useFetchAuth();

export const logiqueInterventionService = {

    getAll: async (): Promise<LogiqueIntervention[]> => {
        const response = await fetchAuth("/api/rapports/LI", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || err.error || `Erreur serveur: ${response.status}`);
        }
        const data = await response.json();
        const items = data.data || data;
        return items.map((item: { id: number; name: string }) => ({ id: item.id, nom: item.name }));
    },

    create: async (nom: string): Promise<LogiqueIntervention> => {
        const response = await fetchAuth("/api/rapports/LI", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nom }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || err.error || `Erreur serveur: ${response.status}`);
        }
        const data = await response.json();
        const item = data.data || data;
        return { id: item.id, nom: item.name };
    },

    update: async (id: number, nom: string): Promise<LogiqueIntervention> => {
        const response = await fetchAuth(`/api/rapports/LI/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: nom }),
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || err.error || `Erreur serveur: ${response.status}`);
        }
        const data = await response.json();
        const item = data.data || data;
        return { id: item.id, nom: item.name };
    },

    // Pas d'endpoint DELETE dans l'API pour l'instant
    delete: async (_id: number): Promise<void> => {
        await fetchAuth(`/api/rapports/LI/${_id}`, {
            method: "DELETE",
        });
    },
};
