"use client";

import React, { useState, useEffect } from "react";
import { SupervisionTableProps } from "@/features/rapports/types/supervision/supervisionType";
import { ApiRapport } from "@/features/rapports/types";
import { rapportService } from "@/features/rapports/services/rapportService";
import { RapportTableEditor } from "@/features/rapports/components/form/rapports/RapportTableEditor";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AppTableSkeleton } from "@/features/common/components/ui/AppTableSkeleton";

const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const statusClasses: Record<string, string> = {
    VALIDE: "text-green-800 bg-green-50 border border-green-300",
    TRANSMIS: "text-amber-800 bg-amber-50 border border-amber-300",
};

const buttonStatusClasses: Record<string, string> = {
    VALIDE: "bg-red-600 text-white hover:bg-red-700 shadow-red-100",
    TRANSMIS: "bg-green-600 text-white hover:bg-green-700 shadow-green-100",
    DEFAULT: "bg-green-600 text-white hover:bg-green-700"
};

export const SupervisionTable: React.FC<SupervisionTableProps> = ({
    rapports: initialRapports,
    isLoading,
    generatingId,
    onPdfClick,
    onHistoryClick,
    onUpdate
}) => {
    const [listRapports, setListRapports] = useState<ApiRapport[]>(initialRapports);
    const [filteredRapports, setFilteredRapports] = useState<ApiRapport[]>(initialRapports);
    const [localValidatingId, setLocalValidatingId] = useState<number | null>(null);
    const [editingRapport, setEditingRapport] = useState<ApiRapport | null>(null);
    const [searchEntite, setSearchEntite] = useState("");
    const [searchStatut, setSearchStatut] = useState("");
    const router = useRouter();

    useEffect(() => {
        setListRapports(initialRapports);
        setFilteredRapports(initialRapports);
    }, [initialRapports]);

    // Filtrer les rapports par entité et statut
    useEffect(() => {
        let filtered = listRapports;
        
        if (searchEntite) {
            filtered = filtered.filter(rapport => 
                rapport.user?.entite?.toLowerCase().includes(searchEntite.toLowerCase())
            );
        }
        
        if (searchStatut) {
            filtered = filtered.filter(rapport => {
                const statut = (rapport as any).statut || "EN COURS";
                return statut.toLowerCase().includes(searchStatut.toLowerCase());
            });
        }
        
        setFilteredRapports(filtered);
    }, [listRapports, searchEntite, searchStatut]);

    // --- LOGIQUE DE MISE À JOUR LOCALE ---
    const handleUpdateSuccess = (idPrecedent: number, updatedRapport: ApiRapport) => {
        // 1. Mise à jour locale (pour l'affichage immédiat)
        setListRapports(prev =>
            prev.map(r => r.id === idPrecedent ? updatedRapport : r)
        );

        // 2. Notification du parent
        if (onUpdate) {
            onUpdate(idPrecedent, updatedRapport);
        }

        setEditingRapport(null);
        // Optionnel : router.refresh() si vous voulez forcer Next.js à resynchroniser le serveur
        router.refresh();
    };

    const handleValidateInternal = async (id?: number, currentStatut?: string) => {
        try {
            if (!id) return;
            setLocalValidatingId(id);
            await rapportService.changerValidationRapport(id);
            const nextStatut = currentStatut === "VALIDE" ? "EN COURS" : "VALIDE";
            setListRapports(prev =>
                prev.map(r => r.id === id ? { ...r, statut: nextStatut } : r)
            );
            const rapportToUpdate = listRapports.find(r => r.id === id);
            
            if (rapportToUpdate) {
                const updatedRapport = { ...rapportToUpdate, statut: nextStatut };

                // 1. Mise à jour locale
                setListRapports(prev =>
                    prev.map(r => r.id === id ? updatedRapport : r)
                );

                // 2. Notification du parent (Crucial pour que le parent change aussi)
                if (onUpdate) {
                    onUpdate(id, updatedRapport);
                }
            }
            // toast.success(`Statut mis à jour : ${nextStatut}`);
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue lors de la validation.");
        } finally {
            setLocalValidatingId(null);
        }
    };

    // --- VUE ÉDITION ---
    if (editingRapport) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <button onClick={() => setEditingRapport(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase">Édition Supervision</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{editingRapport.user?.entite}</p>
                    </div>
                </div>

                <RapportTableEditor
                    rapport={editingRapport}
                    onSuccess={handleUpdateSuccess}
                    isSupervision={true}
                />

                <button onClick={() => setEditingRapport(null)} className="text-xs font-black uppercase text-slate-400 hover:text-slate-600">
                    Annuler l'édition
                </button>
            </div>
        );
    }

    // --- VUE TABLEAU ---
    return (
        <div className="space-y-4">
            {/* Filtres de recherche */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Filtres de recherche</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Entité</label>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchEntite}
                                onChange={(e) => setSearchEntite(e.target.value)}
                                placeholder="Rechercher une entité..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-2">Statut</label>
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <select
                                value={searchStatut}
                                onChange={(e) => setSearchStatut(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="VALIDE">Validé</option>
                                <option value="EN COURS">En cours</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {(searchEntite || searchStatut) && (
                    <button
                        onClick={() => {
                            setSearchEntite("");
                            setSearchStatut("");
                        }}
                        className="mt-4 text-xs text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Réinitialiser les filtres
                    </button>
                )}
            </div>

            {/* Tableau */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {isLoading ? (
                    <AppTableSkeleton rows={6} cols={4} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Entité</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Période</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Statut</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRapports.length > 0 ? (
                                    filteredRapports.map((rapport: ApiRapport) => {
                                        const statut = (rapport as any).statut || "EN COURS";
                                        const isValide = statut === "VALIDE";
                                        const dynamicButtonClass = buttonStatusClasses[statut] || buttonStatusClasses.DEFAULT;

                                        return (
                                            <tr key={rapport.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="text-sm font-bold text-slate-900 uppercase">{rapport.user?.entite}</div>
                                                    <div className="text-[10px] text-slate-400">{rapport.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-slate-500 italic">
                                                            Du {formatDate(rapport.calendrier?.dateDebut)} au {formatDate(rapport.calendrier?.dateFin)}
                                                        </div>
                                                        <div className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md inline-block">
                                                            {rapport.calendrier?.typeCalendrier?.name || "Calendrier"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span 
                                                        className={`whitespace-nowrap inline-block px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full ${statusClasses[statut] || statusClasses.TRANSMIS}`}
                                                    >
                                                        {statut}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                    {!isValide && (
                                                        <button
                                                            onClick={() => setEditingRapport(rapport)}
                                                            className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all"
                                                            title="Modifier le contenu"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => handleValidateInternal(rapport.id, statut)}
                                                        disabled={localValidatingId === rapport.id}
                                                        className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-md disabled:opacity-70 ${dynamicButtonClass}`}
                                                    >
                                                        {localValidatingId === rapport.id ? (
                                                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <span>{isValide ? " 1" : " 1"}</span>
                                                        )}
                                                        {isValide ? "Annuler" : "Valider"}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => onPdfClick(rapport)}
                                                        disabled={generatingId === rapport.id}
                                                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all disabled:opacity-50 font-bold text-xs uppercase tracking-widest"
                                                        title="Générer le PDF"
                                                    >
                                                        {generatingId === rapport.id ? (
                                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <span className="flex items-center gap-1">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                                </svg>
                                                                PDF
                                                            </span>
                                                        )}
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => onHistoryClick(rapport)}
                                                        className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                                                        title="Voir l'historique"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan={4} className="py-20 text-center text-slate-400 uppercase text-[10px] font-black">Aucun rapport.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};