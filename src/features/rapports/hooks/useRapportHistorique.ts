"use client";

import { useState, useCallback } from "react";
import { ApiRapport } from "../types";
import { rapportService } from "../services/rapportService";
import { toast } from "react-hot-toast";

export const useRapportHistorique = () => {
    const [history, setHistory] = useState<ApiRapport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async (idUtilisateur: number, idCalendrier: number) => {
        if (!idUtilisateur || idUtilisateur <= 0 || !idCalendrier || idCalendrier <= 0) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await rapportService.getHistorique(idUtilisateur, idCalendrier);
            setHistory(data);
        } catch (err: any) {
            // console.error("Erreur lors de la récupération de l'historique:", err);
            const msg = err.message||err.error||"Impossible de charger l'historique.";
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearHistory = useCallback(() => {
        setHistory([]);
        setError(null);
    }, []);

    return {
        history,
        isLoading,
        error,
        fetchHistory,
        clearHistory,
    };
};
