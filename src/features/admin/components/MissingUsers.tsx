import React, { useEffect, useState } from "react";
import { User } from "../../auth/types";
import { periodeService as configPeriodeService } from "@/features/config/services/periodeService";
import { useAdminPilotage } from "../context/AdminPilotageContext";
import { usePeriodes, useCalendrierSupervision } from "@/features/config/hooks/usePeriodes";
import toast from "react-hot-toast";

// Sous-composants
import { MissingUsersToolbar } from "./manquants/MissingUsersToolbar";
import { MissingUsersTable } from "./manquants/MissingUsersTable";
import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";

export const MissingUsers = () => {
    const {
        selectedTypeId,
        setSelectedTypeId,
        selectedPeriodId,
        setSelectedPeriodId,
        selectedDate,
        setSelectedDate
    } = useAdminPilotage();

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Utiliser useCalendrierSupervision avec la date sélectionnée
    const calendrierResult = useCalendrierSupervision(selectedDate);
    const [calendrier, setCalendrier] = useState<CalendarPeriod | undefined>(undefined);

    useEffect(() => {
        // Si aucune période sélectionnée, utiliser la première période disponible
        if (!selectedPeriodId && calendrierResult.data.length > 0) {
            setCalendrier(calendrierResult.data[0]);
            return;
        }

        if (!selectedPeriodId) {
            setUsers([]);
            setIsLoading(false);
            return;
        }

        // Rechercher la période sélectionnée et charger les utilisateurs
        if (calendrierResult.data.length > 0) {
            const period = calendrierResult.data.find((period) => period.id === Number(selectedPeriodId));
            if (period) {
                setCalendrier(period);
                
                // Charger les utilisateurs seulement si la période a changé
                const fetchMissing = async () => {
                    setIsLoading(true);
                    try {
                        const data = await configPeriodeService.getLateUsers(selectedPeriodId);
                        setUsers(data);
                    } catch (err) {
                        // console.error("Erreur MissingUsers:", err);
                        toast.error("Erreur lors du chargement des retardataires");
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchMissing();
            } else {
                setUsers([]);
                setIsLoading(false);
            }
        }
    }, [selectedPeriodId, selectedTypeId, calendrierResult.data]);

    return (
        <div className="space-y-10">
            {/* 0. Sélecteur de date */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                <label htmlFor="missing-users-calendar-date" className="text-sm font-semibold text-slate-700">
                    Date du calendrier :
                </label>
                <input
                    id="missing-users-calendar-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
            </div>

            {/* 1. En-tête (Filtres et Titre) */}
            <MissingUsersToolbar 
                selectedTypeId={selectedTypeId}
                setSelectedTypeId={setSelectedTypeId}
                selectedPeriodId={selectedPeriodId}
                setSelectedPeriodId={setSelectedPeriodId}
                calendrierResult={calendrierResult}
            />

            {/* 2. Tableau des retardataires */}
            <MissingUsersTable 
                users={users} 
                isLoading={isLoading} 
                calendrierPeriod={calendrier}

            />

            {/* 3. Pied de page / Note d'information */}
            <div className="p-6 border border-slate-100 rounded-xl bg-slate-50/30">
                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                    * Cette liste est générée automatiquement à partir du calendrier institutionnel. Les agents affichés n'ont soumis aucun rapport validé pour la période sélectionnée.
                </p>
            </div>
        </div>
    );
};