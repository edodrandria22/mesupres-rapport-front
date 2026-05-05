"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { periodeService } from "@/features/config/services/periodeService";
import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";
import { TypeCalendrierSelect } from "@/features/config/components/TypeCalendrierSelect";
import { periodSchema, PeriodFormValues } from "@/features/admin/type/period/periodSchema";
import toast from "react-hot-toast";

interface PeriodEditModalProps {
    period: CalendarPeriod;
    onSuccess: () => void;
    onCancel: () => void;
}

/** Extrait "YYYY-MM-DD" depuis une chaîne datetime ou date */
const toDateInput = (value: string): string => {
    if (!value) return "";
    return value.split(" ")[0].split("T")[0];
};

export const PeriodEditModal: React.FC<PeriodEditModalProps> = ({ period, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<PeriodFormValues>({
        resolver: zodResolver(periodSchema),
        defaultValues: {
            debut: toDateInput(period.dateDebut),
            fin: toDateInput(period.dateFin),
            typeCalendrierId: period.typeCalendrier?.id?.toString() ?? period.typeCalendrierId?.toString() ?? "",
        },
    });

    const typeCalendrierId = watch("typeCalendrierId");

    // Pré-remplir si period change
    useEffect(() => {
        setValue("debut", toDateInput(period.dateDebut));
        setValue("fin", toDateInput(period.dateFin));
        setValue(
            "typeCalendrierId",
            period.typeCalendrier?.id?.toString() ?? period.typeCalendrierId?.toString() ?? ""
        );
    }, [period, setValue]);

    const onSubmit = async (data: PeriodFormValues) => {
        if (!period.id) return;
        try {
            await periodeService.updateCalendrier(period.id, {
                dateDebut: data.debut,
                dateFin: data.fin,
                typeCalendrierId: Number(data.typeCalendrierId),
            });
            toast.success("Période mise à jour avec succès !");
            onSuccess();
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la modification");
        }
    };

    return (
        /* Overlay */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            {/* Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Modifier la Période</h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                            ID #{period.id}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
                    >
                        {/* X / close icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
                    {/* Date début */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">
                            Date de début
                        </label>
                        <input
                            type="date"
                            {...register("debut", { onChange: () => trigger("fin") })}
                            className="w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-900 outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition"
                        />
                        {errors.debut && (
                            <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.debut.message}</p>
                        )}
                    </div>

                    {/* Date fin */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">
                            Date de fin
                        </label>
                        <input
                            type="date"
                            {...register("fin")}
                            className={`w-full border rounded-lg px-4 py-3 text-sm text-slate-900 outline-none focus:ring-1 transition ${errors.fin
                                ? "border-red-400 bg-red-50 focus:ring-red-400"
                                : "border-slate-200 bg-slate-50 focus:ring-slate-900 focus:border-slate-900"
                                }`}
                        />
                        {errors.fin && (
                            <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.fin.message}</p>
                        )}
                    </div>

                    {/* Type de calendrier */}
                    <div className="space-y-2">
                        <TypeCalendrierSelect
                            value={typeCalendrierId}
                            onValueChange={(val) => setValue("typeCalendrierId", val, { shouldValidate: true })}
                            label="Type de calendrier"
                        />
                        {errors.typeCalendrierId && (
                            <p className="text-[9px] text-red-500 font-bold uppercase ml-1">
                                {errors.typeCalendrierId.message}
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                "Mettre à jour"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
