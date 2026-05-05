"use client";

import React, { useState, useEffect, useMemo } from "react";
import { rapportService } from "../../services/rapportService";
import { ApiRapport } from "../../types";
import { useCalendrierSupervision, usePeriodes } from "@/features/config/hooks/usePeriodes";
import { usePdfExport } from "../../hooks/usePdfExport";
import { exportToWord } from "../../utils/exportUtils";

// Imports des sous-composants
import { RapportView } from "./RapportView";
import { SupervisionToolbar } from "../form/supervisors/SupervisionToolbar";
import { SupervisionTable } from "../form/supervisors/SupervisionTable";
import { useRapportHistorique } from "../../hooks/useRapportHistorique";
import { HistoriqueListView } from "./HistoriqueListView";
import { HistoriqueDetailView } from "./HistoriqueDetailView";
import { toast } from "react-hot-toast";
export const SupervisionView: React.FC = () => {
    // --- ÉTATS ---
    const [rapports, setRapports] = useState<ApiRapport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<number | string | null>(null);

    const [selectedTypeId, setSelectedTypeId] = useState<string>("");
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
    const [entiteFilter, setEntiteFilter] = useState("");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // --- ÉTAT NAVIGATION HISTORIQUE ---
    const [viewMode, setViewMode] = useState<"LIST" | "HISTORY_LIST" | "HISTORY_DETAIL">("LIST");
    const [selectedHistoryRapport, setSelectedHistoryRapport] = useState<ApiRapport | null>(null);
    const { history, isLoading: isHistoryLoading, fetchHistory, clearHistory } = useRapportHistorique();

    // --- NOUVEL ÉTAT POUR LES POINTS ---
    const [isPdfMode, setIsPdfMode] = useState<boolean>(true);

    // Hook d'exportation
    const { exportToPdf, isGenerating: isGeneratingPdf } = usePdfExport();
    
    // État séparé pour l'export Word
    const [isGeneratingWord, setIsGeneratingWord] = useState<boolean>(false);

    // Data for the hidden rendering zone
    const [selectedForPdf, setSelectedForPdf] = useState<ApiRapport[] | null>(null);

    const calendrierResult = useCalendrierSupervision(selectedDate);
    // --- ÉTATS ---
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // --- AUTO-SELECTION DE LA PÉRIODE ---
    useEffect(() => {
        if (!selectedPeriodId && calendrierResult.data && calendrierResult.data.length > 0) {
            const firstId = calendrierResult.data[0].id;
            if (firstId) {
                // On sélectionne la première période (la plus récente normalement)
                setSelectedPeriodId(firstId.toString());
            }
        }
    }, [calendrierResult.data, selectedPeriodId]);

    // --- CHARGEMENT ---
    useEffect(() => {
        const idCal = Number(selectedPeriodId);
        if (!idCal || idCal <= 0) {
            setRapports([]);
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            try {
                const data = await rapportService.getAllRapports(idCal);
                setRapports(data);
            } catch (err) {
                // console.log("Erreur lors du chargement des rapports:", err);
                toast.error("Erreur lors du chargement des rapports");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [selectedPeriodId]);

    // --- LOGIQUE FILTRES ---
    const entites = useMemo(() => {
        const unique = new Map();
        rapports.forEach(r => {
            if (r.user?.entite) unique.set(r.user.entite, r.user.entite);
        });
        return Array.from(unique.values()).sort();
    }, [rapports]);

    const filtered = useMemo(() => {
        // 1. Filtrage
        let result = [...rapports];
        if (entiteFilter) {
            result = result.filter(r => r.user?.entite === entiteFilter);
        }

        // 2. Tri par user.rang
        return result.sort((a, b) => {
            const rangA = a.user?.rang ?? 0;
            const rangB = b.user?.rang ?? 0;
            
            return sortOrder === "asc" 
                ? rangA - rangB 
                : rangB - rangA;
        });
    }, [rapports, entiteFilter, sortOrder]); // Ajoutez sortOrder ici

    // --- ACTIONS HISTORIQUE ---
    const handleOpenHistory = (rapport: ApiRapport) => {
        // console.log("Rapport sélectionné:", rapport);
        if (rapport.user?.id && rapport.calendrier.id) {
            fetchHistory(rapport.user.id, rapport.calendrier.id);
            setViewMode("HISTORY_LIST");
        } else {
            toast.error("Informations insuffisantes pour charger l'historique.");
        }
    };

    const handleSelectHistoryVersion = (version: ApiRapport) => {
        setSelectedHistoryRapport(version);
        setViewMode("HISTORY_DETAIL");
    };

    const handleBackFromHistoryList = () => {
        setViewMode("LIST");
        clearHistory();
    };

    const handleBackFromHistoryDetail = () => {
        setViewMode("HISTORY_LIST");
        setSelectedHistoryRapport(null);
    };

    // --- ACTIONS ---
    const handleConsulter = async (reports: ApiRapport[]) => {
        // 1. Filtrer pour ne garder que les rapports validés
        const validReports = reports.filter(r => r.statut === "VALIDE");

        // 2. Vérifier s'il reste des rapports après filtrage
        if (validReports.length === 0) {
            toast.error("Aucun rapport valide à exporter."); // Optionnel : prévenir l'utilisateur
            return;
        }

        // 3. Détecter si c'est un rapport trimestriel (pour le mode paysage)
        const isLandscape = validReports.some(r => 
            r.calendrier?.typeCalendrier?.id === 3 || r.calendrier?.typeCalendrier?.id === 4
        );

        // On s'assure que le mode PDF est activé
        setIsPdfMode(true);

        // Utiliser 'validReports' au lieu de 'reports' pour la suite
        const id = validReports.length === 1 ? (validReports[0].id || "temp") : "consolidation";
        setGeneratingId(id);
        setSelectedForPdf(validReports);

        setTimeout(async () => {
            const filename = validReports.length > 1
                ? "Consolidation_Rapports_Valides.pdf"
                : `Rapport_${validReports[0].user?.entite || "Inconnu"}_Valide.pdf`;

            await exportToPdf("rapport-a4-container", filename, isLandscape);

            setGeneratingId(null);
            setSelectedForPdf(null);
        }, 600);
    };
    const [selectedForPdfRay, setSelectedForPdfRay] = useState<ApiRapport | null>(null);
    const handlePdfClick = async (rapport: ApiRapport) => {
            const idRp = rapport.id !== undefined ? rapport.id : 0;
            const isLandscape = rapport.calendrier?.typeCalendrier?.id === 3 || rapport.calendrier?.typeCalendrier?.id === 4;
            setGeneratingId(idRp);
            setSelectedForPdfRay(rapport);
    
            setTimeout(() => {
                const year = new Date(rapport.calendrier.dateDebut).getFullYear();
                exportToPdf("rapport-a4-container", `Rapport_H${year}_ID${rapport.id}.pdf`, isLandscape)
                    .finally(() => {
                        setGeneratingId(null);
                        setSelectedForPdfRay(null);
                    });
            }, 500);
    };

    const handleExportWord = async (reports: ApiRapport[]) => {
        // 1. Filtrer pour ne garder que les rapports dont le statut est "VALIDE"
        const validReports = reports.filter(r => r.statut === "VALIDE");

        // 2. Vérifier s'il y a des rapports valides avant de continuer
        if (validReports.length === 0) {
            toast.error("Aucun rapport valide trouvé pour l'export Word.");
            return;
        }

        // 3. Détecter si c'est un rapport trimestriel (pour le mode paysage)
        const isLandscape = validReports.some(r => 
            r.calendrier?.typeCalendrier?.id === 3 || r.calendrier?.typeCalendrier?.id === 4
        );

        // Désactivation du mode PDF (points/styles spécifiques) pour l'export Word
        setIsPdfMode(false);

        // Utilisation de la liste filtrée 'validReports'
        const id = validReports.length === 1 
            ? (validReports[0].id || "temp-word") 
            : "consolidation-word";
            
        setGeneratingId(id);
        setSelectedForPdf(validReports);

        setTimeout(() => {
            // Calcul du nom de fichier basé sur les rapports valides
            const filename = validReports.length > 1
                ? "Consolidation_Rapports_Valides.doc"
                : `Rapport_${validReports[0].user?.entite || "Inconnu"}_Valide.doc`;

            // Lancement de l'export avec le mode paysage si nécessaire
            exportToWord("rapport-a4-container", filename, isLandscape);

            // Réinitialisation de l'état
            setGeneratingId(null);
            setSelectedForPdf(null);
            
            // On repasse en mode PDF par défaut (avec points)
            setIsPdfMode(true);
        }, 600);
    };
    const handleRapportUpdated = (idPrecedent: number, updatedRapport: ApiRapport) => {
        // On met à jour la liste du parent
        setRapports(prev => 
            prev.map(r => r.id === idPrecedent ? updatedRapport : r)
        );
    };
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        // On réinitialise l'ID de la période pour forcer le useEffect à sélectionner
        // la nouvelle première période du nouveau calendrier
        setSelectedPeriodId("");
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                <label htmlFor="calendar-date" className="text-sm font-semibold text-slate-700">
                    Date du calendrier :
                </label>
                <input
                    id="calendar-date"
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                />
            </div>
            {/* 1. Barre d'outils */}
            <SupervisionToolbar
                selectedTypeId={selectedTypeId}
                setSelectedTypeId={setSelectedTypeId}
                selectedPeriodId={selectedPeriodId}
                setSelectedPeriodId={setSelectedPeriodId}
                entiteFilter={entiteFilter}
                setEntiteFilter={setEntiteFilter}
                entites={entites}
                calendrierResult={calendrierResult}
                rapports={filtered}
                onConsulter={() => handleConsulter(viewMode === "HISTORY_DETAIL" && selectedHistoryRapport ? [selectedHistoryRapport] : filtered)}
                onExportWord={() => handleExportWord(viewMode === "HISTORY_DETAIL" && selectedHistoryRapport ? [selectedHistoryRapport] : filtered)}
                isGeneratingPdf={isGeneratingPdf}
                isGeneratingWord={isGeneratingWord}
            />

            {/* 2. Contenu en fonction du mode de vue */}
            {viewMode === "LIST" && (
                <>
                    <div className="flex items-center gap-3">
                        <div className="h-0.5 w-4 bg-slate-900"></div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                            Documents reçus : <span className="text-slate-900 font-extrabold text-xs">{filtered.length}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                        >
                            {sortOrder === "asc" ? "↑" : "↓"} Rang
                        </button>
                    </div>

                    <SupervisionTable
                        rapports={filtered}
                        isLoading={isLoading}
                        generatingId={generatingId}
                        onPdfClick={handlePdfClick}
                        onHistoryClick={handleOpenHistory}
                        onUpdate={handleRapportUpdated}
                    />
                </>
            )}

            {viewMode === "HISTORY_LIST" && (
                <HistoriqueListView
                    history={history}
                    isLoading={isHistoryLoading}
                    onSelectVersion={handleSelectHistoryVersion}
                    onBack={handleBackFromHistoryList}
                />
            )}

            {viewMode === "HISTORY_DETAIL" && selectedHistoryRapport && (
                <HistoriqueDetailView
                    rapport={selectedHistoryRapport}
                    onBack={handleBackFromHistoryDetail}
                />
            )}

            {/* 4. ZONE DE RENDU MASQUÉE */}
            {selectedForPdf && (
                <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
                    <div id="rapport-a4-container" style={{ width: "210mm" }}>
                        <RapportView
                            data={selectedForPdf}
                            isPrintMode={true}
                            isPdf={isPdfMode} // Transmission de l'argument ici
                        />
                    </div>
                </div>
            )}
            {selectedForPdfRay && (
                <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
                    <div id="rapport-a4-container" style={{ width: "210mm" }}>
                        <RapportView
                            data={[selectedForPdfRay]}
                            isPrintMode={true}
                            isLandscape={selectedForPdfRay.calendrier?.typeCalendrier?.id === 3}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};