import React from "react";
import { StatCardProps } from "@/features/rapports/types/admin/dashboard/adminDashboard";
export const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    sub, 
    color, 
    isLate, 
    isRefreshing = false 
}) => {
    return (
        <div className={`bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col gap-3 transition-all duration-500 overflow-hidden relative group hover:border-blue-200 ${isRefreshing ? "opacity-40 scale-[0.98] blur-[1px]" : "opacity-100 scale-100 blur-0"}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] -mr-12 -mt-12 rounded-full transition-transform duration-700 group-hover:scale-110`}></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-black tracking-tighter ${isLate ? "text-red-500" : "text-slate-900"}`}>
                    {value}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    );
};