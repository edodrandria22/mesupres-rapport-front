"use client";

import React from "react";
import { ApiRapport } from "../../types";
import { RapportHeader } from "./sub/RapportHeader";
import { RapportTable } from "./sub/RapportTable";
import { RapportFooter } from "./sub/RapportFooter";

interface HistoriqueDetailViewProps {
    rapport: ApiRapport;
    onBack: () => void;
}

export const HistoriqueDetailView: React.FC<HistoriqueDetailViewProps> = ({
    rapport,
    onBack
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
                    >
                        <span className="text-xl">←</span>
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Détail de la version</h2>
                        <p className="text-xs text-slate-500">Visualisation en mode lecture seule</p>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center bg-slate-50 rounded-2xl border border-slate-200 p-8 overflow-hidden">
                <div
                    id="history-report-content"
                    className="bg-white font-sans text-[12px] shadow-2xl"
                    style={{
                        width: "210mm",
                        minHeight: "297mm",
                        padding: "20mm",
                        boxSizing: "border-box",
                        color: "#000000",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: "40px",
                    }}
                >
                    {/* Header */}
                    <RapportHeader />

                    {/* Content */}
                    <div className="w-full">
                        <RapportTable rapport={rapport} isPdf={true} />
                    </div>

                    {/* Footer */}
                    {/* <div style={{ marginTop: "auto", paddingTop: "40px" }}>
                        <RapportFooter rapport={rapport} />
                    </div> */}
                </div>
            </div>
        </div>
    );
};
