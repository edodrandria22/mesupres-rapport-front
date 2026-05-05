"use client";

import React, { useState, useEffect } from "react";
import { ApiRapport } from "@/features/rapports/types";
import { RapportTableEditor } from "@/features/rapports/components/form/rapports/RapportTableEditor";
import { useRouter } from "next/navigation";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";

interface DashboardTableProps {
    rapports: ApiRapport[];
    isLoading: boolean;
    generatingId: number | null;
    onPdfClick: (rapport: ApiRapport) => void;
    onUpdate?: (idPrecedent: number, updatedRapport: ApiRapport) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
    rapports: initialRapports,
    isLoading,
    generatingId,
    onPdfClick,
    onUpdate
}) => {
    // 1. État local pour la liste (permet la mise à jour sans rechargement)
    const [listRapports, setListRapports] = useState<ApiRapport[]>(initialRapports);
    const [editingRapport, setEditingRapport] = useState<ApiRapport | null>(null);
    const router = useRouter();

    // Synchroniser si les props changent (ex: filtres ou pagination)
    useEffect(() => {
        setListRapports(initialRapports);
    }, [initialRapports]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    };

    const statusClasses: Record<string, string> = {
        VALIDE: "text-green-800 bg-green-50 border-green-300",
        TRANSMIS: "text-blue-800 bg-blue-50 border-blue-300",
        "EN COURS": "text-amber-800 bg-amber-50 border-amber-300",
    };

    // 2. Fonction de succès appelée par l'éditeur
    const handleUpdateSuccess = (idPrecedent: number, updatedData: ApiRapport) => {
        // Mise à jour de la liste locale (on remplace le vieux rapport par le nouveau)
        // console.log("Updated Data:", updatedData);
        setListRapports(prev =>
            prev.map(r => r.id === idPrecedent ? updatedData : r)
        );
        if (onUpdate) {
            onUpdate(idPrecedent, updatedData);
        }
        // Quitter le mode édition
        setEditingRapport(null);

        // Optionnel : Forcer Next.js à rafraîchir le cache serveur
        router.refresh();
    };

    // --- VUE ÉDITION ---
    if (editingRapport) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setEditingRapport(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase">Modification du rapport</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Période du {formatDate(editingRapport.calendrier.dateDebut)}</p>
                        </div>
                    </div>
                </div>

                <RapportTableEditor
                    rapport={editingRapport}
                    onSuccess={handleUpdateSuccess}
                />

                <div className="flex justify-end gap-3">
                    <button onClick={() => setEditingRapport(null)} className="px-6 py-3 text-xs font-black uppercase text-slate-500">
                        Annuler
                    </button>
                </div>
            </div>
        );
    }

    // --- VUE TABLEAU ---
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {isLoading ? (
                <AppTableSkeleton rows={5} cols={4} />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Période</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Entité</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Statut</th>
                                <th className="px-6 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {listRapports.map((rapport: ApiRapport) => (
                                <tr key={rapport.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="px-6 py-5 border-r border-slate-100">
                                        <div className="space-y-1">
                                            <div className="text-sm font-black text-slate-900">Du {formatDate(rapport.calendrier.dateDebut)}</div>
                                            <div className="text-[10px] font-medium text-slate-400 uppercase">au {formatDate(rapport.calendrier.dateFin)}</div>
                                            <div className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md inline-block">
                                                {rapport.calendrier.typeCalendrier?.name || "Calendrier"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-100">
                                        <span className="text-[11px] font-bold text-slate-600 uppercase">{rapport.user.entite || "N/A"}</span>
                                    </td>
                                    <td className="px-6 py-4 border-r border-slate-100 text-center">
                                        <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-md border ${statusClasses[rapport.statut || "EN COURS"]}`}>
                                            {rapport.statut || "EN COURS"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {/* On affiche le bouton seulement si le statut n'est pas "VALIDE" */}
                                        {rapport.statut !== "VALIDE" && (
                                            <button 
                                                onClick={() => setEditingRapport(rapport)} 
                                                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-slate-700"
                                            >
                                                Modifier
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => onPdfClick(rapport)} 
                                            disabled={generatingId === rapport.id} 
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-lg"
                                        >
                                            {generatingId === rapport.id ? "..." : "PDF"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};