"use client";

import React, { useState } from "react";
import { rechercheService } from "@/features/rapports/services/rechercheService";
import { ApiRapport } from "@/features/rapports/types";
import { formatLongDate } from "@/features/common/utils/dateUtils";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";
import { usePdfExport } from "@/features/rapports/hooks/usePdfExport";
import { RapportView } from "@/features/rapports/components/vision/RapportView";
import { APP_CONSTANTS } from "@/config/constants";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import toast from "react-hot-toast";
import { audioService } from "@/hooks/audioService";

export default function RecherchePage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [rapports, setRapports] = useState<ApiRapport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // PDF Export — même logique que DashboardPage
    const { exportToPdf } = usePdfExport();
    const [selectedForPdf, setSelectedForPdf] = useState<ApiRapport | null>(null);
    const [generatingId, setGeneratingId] = useState<number | null>(null);

    const handlePdfClick = async (rapport: ApiRapport) => {
        // console.log(rapport)
        const idRp = rapport.id !== undefined ? rapport.id : 0;
        setGeneratingId(idRp);
        setSelectedForPdf(rapport);
        setTimeout(() => {
            const year = new Date(rapport.calendrier.dateDebut).getFullYear();
            exportToPdf("rapport-a4-container", `Rapport_H${year}_ID${rapport.id}.pdf`)
                .finally(() => {
                    setGeneratingId(null);
                    setSelectedForPdf(null);
                });
        }, 500);
    };
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;
        setIsLoading(true);
        setHasSearched(true);
        setError(null);
        try {
            const results = await rechercheService.searchRapportsByDate(selectedDate);
            audioService.playSuccessRecherche();
            setRapports(results);
        } catch (err: any) {
            // console.error("Erreur lors de la recherche:", err);
            const message = err.message || err.error || "Une erreur est survenue lors de la recherche.";
            toast.error(message);
            setError(message);
            setRapports([]);
        } finally {
            setIsLoading(false);
        }
    };
    const handleRapportUpdated = (idPrecedent: number, updatedRapport: ApiRapport) => {
                // On met à jour la liste du parent
                setRapports(prev => 
                    prev.map(r => r.id === idPrecedent ? updatedRapport : r)
                );
    };

    return (
        <div className="space-y-10 pb-20 px-4 md:px-0 max-w-7xl mx-auto">

            {/* ── 1. En-tête ── */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-1 bg-slate-900 rounded-full" />
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
                        Recherche de rapports
                    </h1>
                </div>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] ml-4">
                    Consulter les rapports par date spécifique
                </p>
            </div>

            {/* ── 2. Barre de recherche (remplace les KPIs du Dashboard) ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-6 max-w-2xl">
                    <div className="w-full space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Sélectionner une date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-slate-700 bg-slate-50/30"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || !selectedDate}
                        className="w-full md:w-48 py-4 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Recherche...
                            </span>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Rechercher
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* ── 3. Bandeau d'erreur ── */}
            {error && (
                <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-bold uppercase tracking-wide">{error}</span>
                </div>
            )}

            {/* ── 4. Tableau des résultats — copie exacte du DashboardTable ── */}
            <DashboardTable
                rapports={rapports}
                isLoading={isLoading}
                generatingId={generatingId}
                onPdfClick={handlePdfClick}
                onUpdate={handleRapportUpdated}
            />
            {selectedForPdf && (
                            <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
                                <div id="rapport-a4-container" style={{ width: "210mm" }}>
                                    <RapportView data={[selectedForPdf]} isPrintMode={true} />
                                </div>
                            </div>
                        )}


        </div>
    );
}
