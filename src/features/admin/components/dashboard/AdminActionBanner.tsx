import React from "react";
import { AdminActionBannerProps } from "@/features/rapports/types/admin/dashboard/adminDashboard";

export const AdminActionBanner: React.FC<AdminActionBannerProps> = ({ 
    onActionClick, 
    isDisabled 
}) => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-200">
            <div className="space-y-2">
                <h2 className="text-xl font-bold text-white tracking-tighter uppercase">Action Requise</h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-lg">
                    Identifiez et notifiez les entités en retard pour assurer la consolidation des rapports dans les délais.
                </p>
            </div>
            <button
                onClick={onActionClick}
                disabled={isDisabled}
                className="px-10 py-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all shadow-xl shadow-red-500/20 active:scale-95 whitespace-nowrap disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
            >
                Relancer les manquants
            </button>
        </div>
    );
};