"use client";

import React from "react";
import { ApiRapport } from "../../types";

interface HistoriqueListViewProps {
    history: ApiRapport[];
    isLoading: boolean;
    onSelectVersion: (rapport: ApiRapport) => void;
    onBack: () => void;
}

const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const HistoriqueListView: React.FC<HistoriqueListViewProps> = ({
    history,
    isLoading,
    onSelectVersion,
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
                        <h2 className="text-lg font-bold text-slate-900">Historique des modifications</h2>
                        <p className="text-xs text-slate-500">Consultez les versions précédentes de ce rapport</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date de modification</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Auteur</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5"><div className="h-4 w-32 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-4 w-48 bg-slate-100 rounded"></div></td>
                                        <td className="px-6 py-5"><div className="h-8 w-16 bg-slate-100 rounded ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : history.length > 0 ? (
                                history.map((rapport, index) => (
                                    <tr key={rapport.id || index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-slate-900">
                                                {/* On suppose que la date de modification est stockée ou qu'on utilise l'ID pour l'ordre */}
                                                Version du {formatDate(rapport.deletedAt)} {/* À ajuster selon les données réelles de l'API */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-slate-600 font-medium">{rapport.user?.email}</div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{rapport.user?.entite}</div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => onSelectVersion(rapport)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md shadow-slate-200"
                                            >
                                                👁️ Voir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-4xl">🕒</span>
                                            <p className="text-slate-500 text-sm">Aucun historique disponible pour ce rapport.</p>
                                        </div>
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
