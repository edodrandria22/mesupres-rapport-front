"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// Services & Context
import { adminService } from "../services/adminService";
import { periodeService as configPeriodeService } from "@/features/config/services/periodeService";
import { useAdminPilotage } from "../context/AdminPilotageContext";
import { usePeriodes, useCalendrierSupervision } from "@/features/config/hooks/usePeriodes";
import { User } from "../../auth/types";

// Sous-composants
import { StatCard } from "./dashboard/StatCard";
import { AdminActionBanner } from "./dashboard/AdminActionBanner";
import { AdminDashboardToolbar } from "./dashboard/AdminDashboardToolbar";
import toast from "react-hot-toast";

export const AdminDashboard = () => {
    const router = useRouter();
    const {
        selectedTypeId,
        setSelectedTypeId,
        selectedPeriodId,
        setSelectedPeriodId,
        selectedDate,
        setSelectedDate
    } = useAdminPilotage();

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [lateUsers, setLateUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Utiliser useCalendrierSupervision avec la date sélectionnée
    const calendrierResult = useCalendrierSupervision(selectedDate);

    // 1. Chargement de la liste globale
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await adminService.getAllUtilisateurs();
                setAllUsers(data);
            } catch (err) {
                toast.error("Erreur lors du chargement des utilisateurs");
                // console.error("Erreur getAllUtilisateurs:", err);

            } finally {
                if (!selectedPeriodId) setIsLoading(false);
            }
        };
        fetchAll();
    }, [selectedPeriodId]);

    // 2. Chargement des retardataires
    useEffect(() => {
        if (!selectedPeriodId) {
            setLateUsers([]);
            return;
        }

        const fetchLate = async () => {
            setIsRefreshing(true);
            try {
                const missing = await configPeriodeService.getLateUsers(selectedPeriodId);
                setLateUsers(missing);
            } catch (err) {
                // console.error("Erreur getLateUsers:", err);
                toast.error("Erreur lors du chargement des retardataires");
            } finally {
                setIsRefreshing(false);
                setIsLoading(false);
            }
        };
        fetchLate();
    }, [selectedPeriodId]);

    // 3. Calculs dynamiques
    const counters = useMemo(() => {
        const total = allUsers.length;
        const late = selectedPeriodId ? lateUsers.length : 0;
        const ok = selectedPeriodId ? Math.max(0, total - late) : 0;

        return {
            total,
            late,
            ok,
            hasSelection: !!selectedPeriodId
        };
    }, [allUsers, lateUsers, selectedPeriodId]);

    const handleRedirect = () => {
        if (selectedPeriodId) {
            router.push(`/supervision/manquants`);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* 0. Sélecteur de date */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                <label htmlFor="admin-calendar-date" className="text-sm font-semibold text-slate-700">
                    Date du calendrier :
                </label>
                <input
                    id="admin-calendar-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
            </div>

            {/* 1. Barre d'outils refactorisée */}
            <AdminDashboardToolbar 
                selectedTypeId={selectedTypeId}
                setSelectedTypeId={setSelectedTypeId}
                selectedPeriodId={selectedPeriodId}
                setSelectedPeriodId={setSelectedPeriodId}
                calendrierResult={calendrierResult}
            />

            {/* 2. Rendu Conditionnel des Statistiques */}
            {(!counters.hasSelection && !isLoading) ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard title="Total Agents" value={counters.total} sub="Inscrits" color="from-blue-500 to-indigo-500" />
                        <StatCard title="Rapports Reçus" value="--" sub="Transmis" color="from-slate-100 to-slate-200" />
                        <StatCard title="Manquants" value="--" sub="Retard" color="from-slate-100 to-slate-200" />
                    </div>

                    <div className="py-20 text-center space-y-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 mx-auto max-w-4xl">
                        <div className="text-slate-300">
                            <svg className="w-12 h-12 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Veuillez sélectionner une période pour analyser les transmissions</p>
                    </div>
                </div>
            ) : isLoading || (isRefreshing && lateUsers.length === 0 && counters.total === 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-slate-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <StatCard title="Total" value={counters.total} sub="Inscrits" color="from-blue-500 to-indigo-500" isRefreshing={isRefreshing} />
                        <StatCard title="Rapports Reçus" value={counters.ok} sub="Transmis" color="from-emerald-500 to-teal-500" isRefreshing={isRefreshing} />
                        <StatCard title="Manquants" value={counters.late} sub="Restant" color="from-red-500 to-rose-600" isLate={true} isRefreshing={isRefreshing} />
                    </div>

                    {/* 3. Bannière d'Action refactorisée */}
                    <AdminActionBanner 
                        onActionClick={handleRedirect} 
                        isDisabled={!selectedPeriodId} 
                    />
                </div>
            )}
        </div>
    );
};