"use client";

import React, { useEffect, useState } from "react";
import { rapportService } from "@/features/rapports/services/rapportService";
import { ApiRapport } from "@/features/rapports/types";
import { usePdfExport } from "@/features/rapports/hooks/usePdfExport";
import { RapportView } from "@/features/rapports/components/vision/RapportView";

// Sous-composants
import { DashboardToolbar } from "./components/DashboardToolbarProps";
import { DashboardTable } from "./components/DashboardTable";
import { usePeriodes } from "../config/hooks/usePeriodes";
import toast from "react-hot-toast";

export default function DashboardPage() {
    const [rapports, setRapports] = useState<ApiRapport[]>([]);
    // const [filtered, setFiltered] = useState<ApiRapport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

    const { exportToPdf } = usePdfExport();
    const [selectedForPdf, setSelectedForPdf] = useState<ApiRapport | null>(null);
    const [generatingId, setGeneratingId] = useState<number | null>(null);
    const calendrierResult = usePeriodes(false);

    const handlePdfClick = async (rapport: ApiRapport) => {
        const idRp = rapport.id !== undefined ? rapport.id : 0;
        const isLandscape = rapport.calendrier?.typeCalendrier?.id === 3 || rapport.calendrier?.typeCalendrier?.id === 4;
        setGeneratingId(idRp);
        setSelectedForPdf(rapport);

        setTimeout(() => {
            const year = new Date(rapport.calendrier.dateDebut).getFullYear();
            exportToPdf("rapport-a4-container", `Rapport_H${year}_ID${rapport.id}.pdf`, isLandscape)
                .finally(() => {
                    setGeneratingId(null);
                    setSelectedForPdf(null);
                });
        }, 500);
    };
    const handleRapportUpdated = (idPrecedent: number, updatedRapport: ApiRapport) => {
            // On met à jour la liste du parent
            setRapports(prev => 
                prev.map(r => r.id === idPrecedent ? updatedRapport : r)
            );
    };
    

    useEffect(() => {
        const fetchRapports = async () => {
            try {
                const data = await rapportService.getRapports();
                setRapports(data);
                // setFiltered(data);
            } catch (err) {
                toast.error("Erreur lors de la récupération des rapports");
                // console.error("Erreur lors de la récupération des rapports:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRapports();
    }, []);

    // useEffect(() => {
    //     console.log("rapports", rapports);
    //     if (!selectedPeriodId) {
    //         setFiltered(rapports);
    //         return;
    //     }
    //     const filteredData = rapports.filter(r => r.calendrier.id === Number(selectedPeriodId));
    //     setFiltered(filteredData);
    // }, [selectedPeriodId, rapports]);

    return (
        <div className="space-y-10 pb-20 px-4 md:px-0 max-w-7xl mx-auto">
            {/* 1. Header & Filtres */}
            <DashboardToolbar
                selectedPeriodId={selectedPeriodId}
                setSelectedPeriodId={setSelectedPeriodId}
                calendrierResult={calendrierResult}
            />

            {/* 2. Tableau des rapports */}
            <DashboardTable
                rapports={rapports}
                isLoading={isLoading}
                generatingId={generatingId}
                onPdfClick={handlePdfClick}
                onUpdate={handleRapportUpdated}
            />

            {/* Zone de rendu PDF masquée */}
            {selectedForPdf && (
                <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
                    <div id="rapport-a4-container" style={{ width: "210mm" }}>
                        <RapportView
                            data={[selectedForPdf]}
                            isPrintMode={true}
                            isLandscape={selectedForPdf.calendrier?.typeCalendrier?.id === 3}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}