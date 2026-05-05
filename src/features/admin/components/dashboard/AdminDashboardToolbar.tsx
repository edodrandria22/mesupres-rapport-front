import React from "react";
import { ToolbarTitle } from "@/features/rapports/components/form/utils/ToolbarTitle";
import { ToolbarSelects } from "@/features/rapports/components/form/utils/ToolbarSelect";

interface AdminDashboardToolbarProps {
    selectedTypeId: string;
    setSelectedTypeId: (val: string) => void;
    selectedPeriodId: string;
    setSelectedPeriodId: (val: string) => void;
    calendrierResult?: any;
}

export const AdminDashboardToolbar: React.FC<AdminDashboardToolbarProps> = ({
    selectedTypeId,
    setSelectedTypeId,
    selectedPeriodId,
    setSelectedPeriodId,
    calendrierResult
}) => {
    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 py-8 mb-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <ToolbarTitle
                title="Pilotage Institutionnel"
                description="Surveillance des transmissions de rapports"
            />

            <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                {/* Utilisation de notre composant réutilisable pour les filtres */}
                <ToolbarSelects
                    selectedTypeId={selectedTypeId}
                    onTypeChange={(val) => {
                        setSelectedTypeId(val);
                        setSelectedPeriodId(""); // Réinitialisation de la période au changement de type
                    }}
                    periodeValue={selectedPeriodId}
                    onPeriodeChange={setSelectedPeriodId}
                    calendrierResult={calendrierResult}
                />
            </div>
        </div>
    );
};