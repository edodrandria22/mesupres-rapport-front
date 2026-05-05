"use client";

import React from "react";
import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";
import { formatLongDate } from "@/features/common/utils/dateUtils";

interface PeriodDeleteModalProps {
    period: CalendarPeriod;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const PeriodDeleteModal: React.FC<PeriodDeleteModalProps> = ({ period, isDeleting, onConfirm, onCancel }) => {
    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
        >
            {/* Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
                {/* Header */}
                <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        {/* Icône poubelle / danger */}
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900 tracking-tight">Supprimer la Période</h2>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Action irréversible</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 py-6 space-y-4">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Êtes-vous sûr de vouloir supprimer la période suivante ?
                    </p>

                    {/* Récapitulatif de la période */}
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 space-y-1">
                        <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Période concernée</p>
                        <p className="text-sm font-bold text-red-700">
                            Du {formatLongDate(period.dateDebut)} au {formatLongDate(period.dateFin)}
                        </p>
                        {period.typeCalendrier?.name && (
                            <p className="text-[11px] text-red-500 font-medium">
                                Type : {period.typeCalendrier.name}
                            </p>
                        )}
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                        Cette action est définitive et ne peut pas être annulée.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isDeleting}
                            className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                "Supprimer"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
