"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { objectifSpecifiqueSchema, ObjectifSpecifiqueFormValues, ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { objectifSpecifiqueService } from "@/features/admin/services/objectifSpecifiqueService";
import toast from "react-hot-toast";

interface ObjectifSpecifiqueEditModalProps {
    item: ObjectifSpecifique;
    onSuccess: () => void;
    onCancel: () => void;
}

export const ObjectifSpecifiqueEditModal: React.FC<ObjectifSpecifiqueEditModalProps> = ({ item, onSuccess, onCancel }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ObjectifSpecifiqueFormValues>({
        resolver: zodResolver(objectifSpecifiqueSchema),
        defaultValues: { nom: item.nom },
    });

    useEffect(() => {
        setValue("nom", item.nom);
    }, [item, setValue]);

    const onSubmit = async (data: ObjectifSpecifiqueFormValues) => {
        try {
            await objectifSpecifiqueService.update(item.id, data.nom);
            toast.success("Objectif spécifique mis à jour !");
            onSuccess();
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la modification");
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Modifier l'objectif</h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">ID #{item.id}</p>
                    </div>
                    <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Nom</label>
                        <textarea
                            {...register("nom")}
                            rows={3}
                            className={`w-full border rounded-lg px-4 py-3 text-sm text-slate-900 outline-none focus:ring-1 transition resize-none ${errors.nom ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400" : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-slate-300 focus:bg-slate-50"}`}
                        />
                        {errors.nom && <p className="text-[9px] text-red-500 font-bold uppercase ml-1">{errors.nom.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onCancel} className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                            Annuler
                        </button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enregistrement...</>
                            ) : "Mettre à jour"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};