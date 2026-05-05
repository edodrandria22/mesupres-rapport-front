import React from "react";
import Link from "next/link";
import { ToolbarTitle } from "@/features/rapports/components/form/utils/ToolbarTitle";
import { PeriodeSelect } from "@/features/config/components/PeriodeSelect";

interface DashboardToolbarProps {
    selectedPeriodId: string;
    setSelectedPeriodId: (val: string) => void;
    calendrierResult?: any;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
    selectedPeriodId,
    setSelectedPeriodId,
    calendrierResult
}) => {
    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-30 py-8 mb-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 transition-all">
            <ToolbarTitle 
                title="Mes Rapports" 
                description="Archives et suivi" 
            />

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                {/* <div className="bg-slate-50 p-1.5 rounded-xl border border-slate-100 flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-[9px] font-bold uppercase px-3 text-slate-400">Filtrer :</span>
                    <PeriodeSelect
                        value={selectedPeriodId}
                        onValueChange={setSelectedPeriodId}
                        calendrierResult={calendrierResult}
                        className="w-full sm:w-[280px] border-none bg-transparent shadow-none focus:ring-0"
                    />
                </div> */}
                {/* <Link
                    href="/dashboard/nouveau"
                    className="w-full sm:w-auto text-center px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                    Nouveau
                </Link> */}
            </div>
        </div>
    );
};