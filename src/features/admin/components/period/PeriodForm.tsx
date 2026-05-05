"use client";

import React, { useEffect, useState, useCallback } from "react";
import { periodeService } from "@/features/config/services/periodeService";
import { CalendarPeriod } from "@/features/rapports/types/calendrier/calendrierType";
import { PeriodCreateForm } from "./form/PeriodCreateForm";
import { PeriodList } from "./liste/PeriodList";
import { PeriodEditModal } from "./PeriodEditModal";
import { PeriodDeleteModal } from "./PeriodDeleteModal";
import { PeriodFormValues } from "@/features/admin/type/period/periodSchema";
import toast from "react-hot-toast";

export const PeriodForm = () => {
    const [periods, setPeriods] = useState<CalendarPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [filters, setFilters] = useState({ start: "", end: "" });
    const [editingPeriod, setEditingPeriod] = useState<CalendarPeriod | null>(null);
    const [deletingPeriod, setDeletingPeriod] = useState<CalendarPeriod | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPeriods = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await periodeService.getPeriods(filters.start || null, filters.end || null);
            setPeriods(data);
        } catch (err) {
            toast.error("Erreur lors du chargement des périodes");
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchPeriods();
    }, [fetchPeriods]);

    const handleCreate = async (data: PeriodFormValues, resetForm: () => void) => {
        setFeedback(null);
        try {
            await periodeService.createPeriod(data.debut, data.fin, Number(data.typeCalendrierId));
            resetForm();
            setFeedback({ type: "success", message: "Période créée avec succès !" });
            fetchPeriods();
            setTimeout(() => setFeedback(null), 3000);
        } catch (err: any) {
            setFeedback({ type: "error", message: err.message || "Erreur de création" });
        }
    };

    const handleEdit = (period: CalendarPeriod) => {
        setEditingPeriod(period);
    };

    const handleEditSuccess = () => {
        setEditingPeriod(null);
        fetchPeriods();
    };

    const handleDeleteRequest = (id: number) => {
        const period = periods.find((p) => p.id === id);
        if (period) setDeletingPeriod(period);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingPeriod?.id) return;
        setIsDeleting(true);
        try {
            await periodeService.deleteCalendrier(deletingPeriod.id);
            toast.success("Période supprimée avec succès !");
            setDeletingPeriod(null);
            fetchPeriods();
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Calendrier</h1>
                        <p className="text-slate-400 text-[11px] font-medium uppercase tracking-widest mt-2 px-1 border-l-2 border-slate-900">Configuration</p>
                    </div>
                    <PeriodCreateForm onSubmit={handleCreate} feedback={feedback} />
                </div>

                <div className="lg:col-span-2">
                    <PeriodList
                        periods={periods}
                        isLoading={isLoading}
                        filterStart={filters.start}
                        filterEnd={filters.end}
                        onFilterChange={(start, end) => setFilters({ start, end })}
                        onEdit={handleEdit}
                        onDelete={handleDeleteRequest}
                    />
                </div>
            </div>

            {/* Modal de modification */}
            {editingPeriod && (
                <PeriodEditModal
                    period={editingPeriod}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setEditingPeriod(null)}
                />
            )}

            {/* Modal de confirmation de suppression */}
            {deletingPeriod && (
                <PeriodDeleteModal
                    period={deletingPeriod}
                    isDeleting={isDeleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => !isDeleting && setDeletingPeriod(null)}
                />
            )}
        </>
    );
};