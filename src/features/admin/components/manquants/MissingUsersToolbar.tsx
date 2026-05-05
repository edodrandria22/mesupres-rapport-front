import React from "react";
import { ToolbarSelects } from "@/features/rapports/components/form/utils/ToolbarSelect";
import { ToolbarTitle } from "@/features/rapports/components/form/utils/ToolbarTitle";
import { MissingUsersToolbarProps } from "@/features/rapports/types/admin/manquants/adminManquants";


export const MissingUsersToolbar: React.FC<MissingUsersToolbarProps> = ({
    selectedTypeId,
    setSelectedTypeId,
    selectedPeriodId,
    setSelectedPeriodId,
    calendrierResult
}) => {
    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 py-8 mb-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <ToolbarTitle
                title="Entites Manquants"
                description="Surveillance des transmissions de rapports"
            />

            <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <ToolbarSelects
                    selectedTypeId={selectedTypeId}
                    onTypeChange={(val) => {
                        setSelectedTypeId(val);
                        setSelectedPeriodId(""); // On vide la période quand le type change
                    }}
                    periodeValue={selectedPeriodId}
                    onPeriodeChange={setSelectedPeriodId}
                    calendrierResult={calendrierResult}
                />
            </div>
        </div>
    );
};