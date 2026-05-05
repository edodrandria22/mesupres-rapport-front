import React from "react";
import { ToolbarSelects } from "../utils/ToolbarSelect";

interface SupervisionToolbarSelectsProps {
    selectedTypeId: string;
    setSelectedTypeId: (val: string) => void;
    selectedPeriodId: string;
    setSelectedPeriodId: (val: string) => void;
    entiteFilter: string;
    setEntiteFilter: (val: string) => void;
    entites: string[];
    calendrierResult: any;
}

export const SupervisionToolbarSelects: React.FC<SupervisionToolbarSelectsProps> = ({
    selectedTypeId,
    setSelectedTypeId,
    selectedPeriodId,
    setSelectedPeriodId,
    entiteFilter,
    setEntiteFilter,
    entites,
    calendrierResult,
}) => {
    return (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 w-full">
            {/* 1. Type et Période (composant générique) */}
            <ToolbarSelects
                selectedTypeId={selectedTypeId}
                onTypeChange={(val) => {
                    setSelectedTypeId(val);
                    setSelectedPeriodId("");
                }}
                periodeValue={selectedPeriodId}
                onPeriodeChange={setSelectedPeriodId}
                calendrierResult={calendrierResult}
            />

            {/* 2. Select Entité (Spécifique à la vue Supervision) */}
            {/* <div className="flex flex-col gap-1 w-full lg:w-[260px]">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">
                    Service
                </span>

                <select
                    value={entiteFilter}
                    onChange={(e) => setEntiteFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg outline-none cursor-pointer text-slate-600 min-h-[40px]"
                >
                    <option value="">Tous les services</option>
                    {entites.map((entite) => (
                        <option key={entite} value={entite} title={entite}>
                            {entite}
                        </option>
                    ))}
                </select>
            </div> */}
        </div>
    );
};