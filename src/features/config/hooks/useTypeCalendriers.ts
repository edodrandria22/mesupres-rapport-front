"use client";

import { useEffect, useState } from "react";
import { TypeCalendrier } from "@/features/admin/services/adminService";
import { typeCalendrierService } from "../services/typeCalendrierService";

export function useTypeCalendriers() {
    const [data, setData] = useState<TypeCalendrier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                setIsLoading(true);
                const result = await typeCalendrierService.getTypeCalendriers();
                setData(result);
                setError(null);
            } catch (err: any) {
                setError(err.message || "Erreur lors du chargement des types de calendriers");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTypes();
    }, []);

    return { data, isLoading, error };
}
