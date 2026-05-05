import { useFetchAuth } from "@/hooks/useFetchAuth";
import { ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";

const fetchAuth = useFetchAuth();

export const objectifSpecifiqueService = {

    getAll: async (): Promise<ObjectifSpecifique[]> => {
        const response = await fetchAuth("/api/rapports/OS", {
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
        // L'API retourne { name, id }, on mappe vers { nom, id }
        return items.map((item: { id: number; name: string }) => ({ id: item.id, nom: item.name }));
    },

    create: async (nom: string): Promise<ObjectifSpecifique> => {
        const response = await fetchAuth("/api/rapports/OS", {
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

    update: async (id: number, nom: string): Promise<ObjectifSpecifique> => {
        const response = await fetchAuth(`/api/rapports/OS/${id}`, {
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
        await fetchAuth(`/api/rapports/OS/${_id}`, {
            method: "DELETE",
        });
        
    },
};
