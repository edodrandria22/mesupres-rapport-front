import React from "react";
import { ToolbarTitle } from "../utils/ToolbarTitle";
import { SupervisionToolbarSelects } from "./SupervisionToolbarSelects";
import { SupervisionToolbarActions } from "./SupervisionToolbarActions";
import { SupervisionToolbarProps } from "@/features/rapports/types/supervision/supervisionType";


export const SupervisionToolbar: React.FC<SupervisionToolbarProps> = ({
    selectedTypeId,
    setSelectedTypeId,
    selectedPeriodId,
    setSelectedPeriodId,
    entiteFilter,
    setEntiteFilter,
    entites,
    calendrierResult,
    rapports,
    onConsulter,
    onExportWord,
    isGeneratingPdf,
    isGeneratingWord,
}) => {

    const hasFilters = Boolean(selectedPeriodId || entiteFilter);

    const handleClearFilters = () => {
        setSelectedPeriodId("");
        setEntiteFilter("");
    };

    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 py-6 mb-4 border-b border-slate-100 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between font-sans">

            {/* 1. Le Titre */}
            <ToolbarTitle
                title="Supervision"
                description="Pilotage inter-entités"
            />

            {/* 2. Bloc filtres : sélecteurs + bouton effacer */}
            <div className="flex flex-col items-start gap-4 w-full lg:w-auto lg:items-end">

                {/* Sélecteurs */}
                <SupervisionToolbarSelects
                    selectedTypeId={selectedTypeId}
                    setSelectedTypeId={setSelectedTypeId}
                    selectedPeriodId={selectedPeriodId}
                    setSelectedPeriodId={setSelectedPeriodId}
                    entiteFilter={entiteFilter}
                    setEntiteFilter={setEntiteFilter}
                    entites={entites}
                    calendrierResult={calendrierResult}
                />

                {/* Bouton Effacer (affiché seulement si filtre actif) */}
                <SupervisionToolbarActions
                    hasFilters={hasFilters}
                    onClearFilters={handleClearFilters}
                    rapports={rapports}
                    entiteFilter={entiteFilter}
                    onConsulter={onConsulter}
                    onExportWord={onExportWord}
                    isGeneratingPdf={isGeneratingPdf}
                    isGeneratingWord={isGeneratingWord}
                />

            </div>
        </div>
    );
};