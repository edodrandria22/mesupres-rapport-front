"use client";

import React from "react";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";

interface LogiqueInterventionDeleteModalProps {
    item: LogiqueIntervention;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const LogiqueInterventionDeleteModal: React.FC<LogiqueInterventionDeleteModalProps> = ({ item, isDeleting, onConfirm, onCancel }) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
        >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
                <div className="px-8 py-6 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 tracking-tight">Supprimer la logique</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Voulez-vous supprimer <span className="font-bold text-slate-700">"{item.nom}"</span> ? Cette action est irréversible.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onCancel} disabled={isDeleting} className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50">
                            Annuler
                        </button>
                        <button type="button" onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isDeleting ? (
                                <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Suppression...</>
                            ) : "Supprimer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
