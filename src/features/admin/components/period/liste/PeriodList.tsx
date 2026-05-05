import React from "react";
import { formatLongDate } from "@/features/common/utils/dateUtils";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";
import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";

interface PeriodListProps {
    periods: CalendarPeriod[];
    isLoading: boolean;
    filterStart: string;
    filterEnd: string;
    onFilterChange: (start: string, end: string) => void;
    onEdit: (period: CalendarPeriod) => void;
    onDelete: (id: number) => void;
}

export const PeriodList = ({ periods, isLoading, filterStart, filterEnd, onFilterChange, onEdit, onDelete }: PeriodListProps) => {
    return (
        <div className="space-y-4">
            {/* Barre de filtre épurée */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 flex flex-wrap items-center gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Du</label>
                        <input 
                            type="date" 
                            value={filterStart} 
                            onChange={(e) => onFilterChange(e.target.value, filterEnd)} 
                            className="block bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-slate-100 transition-all" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-0.5">Au</label>
                        <input 
                            type="date" 
                            value={filterEnd} 
                            onChange={(e) => onFilterChange(filterStart, e.target.value)} 
                            className="block bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-slate-100 transition-all" 
                        />
                    </div>
                </div>
                
                <button 
                    onClick={() => onFilterChange("", "")} 
                    className="mt-5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                    Réinitialiser
                </button>
            </div>

            {/* Table simplifiée */}
            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-left">Périodes</th>
                                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr><td colSpan={2}><AppTableSkeleton rows={5} cols={2} /></td></tr>
                            ) : periods.length > 0 ? (
                                periods.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center flex-wrap gap-3">
                                                <div className="text-[13px] text-slate-600">
                                                    Semaine du <span className="font-semibold text-slate-900">{formatLongDate(p.dateDebut)}</span> au <span className="font-semibold text-slate-900">{formatLongDate(p.dateFin)}</span>
                                                </div>
                                                {p.typeCalendrier?.name && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded-md text-[9px] font-bold uppercase tracking-tighter">
                                                        {p.typeCalendrier.name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {/* Explication des classes :
                                            - opacity-100 : Visible par défaut (Mobile)
                                            - md:opacity-0 : Invisible par défaut sur écran large
                                            - md:group-hover:opacity-100 : Devient visible au survol sur écran large
                                            */}
                                            <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => onEdit(p)}
                                                    className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100"
                                                    title="Modifier"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => p.id && onDelete(p.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                                    title="Supprimer"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-16 text-center">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest italic">Aucun résultat</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};