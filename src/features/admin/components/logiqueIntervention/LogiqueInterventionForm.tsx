"use client";

import { useEffect, useState, useCallback } from "react";
import { logiqueInterventionService } from "@/features/admin/services/logiqueInterventionService";
import { LogiqueIntervention, LogiqueInterventionFormValues } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";
import { LogiqueInterventionCreateForm } from "./form/LogiqueInterventionCreateForm";
import { LogiqueInterventionList } from "./liste/LogiqueInterventionList";
import { LogiqueInterventionEditModal } from "./LogiqueInterventionEditModal";
import { LogiqueInterventionDeleteModal } from "./LogiqueInterventionDeleteModal";
import toast from "react-hot-toast";

export const LogiqueInterventionForm = () => {
    const [items, setItems] = useState<LogiqueIntervention[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [editingItem, setEditingItem] = useState<LogiqueIntervention | null>(null);
    const [deletingItem, setDeletingItem] = useState<LogiqueIntervention | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await logiqueInterventionService.getAll();
            setItems(data);
        } catch {
            toast.error("Erreur lors du chargement des logiques d'intervention");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCreate = async (data: LogiqueInterventionFormValues, resetForm: () => void) => {
        setFeedback(null);
        try {
            await logiqueInterventionService.create(data.nom);
            resetForm();
            setFeedback({ type: "success", message: "Logique d'intervention créée avec succès !" });
            fetchItems();
            setTimeout(() => setFeedback(null), 3000);
        } catch (err: any) {
            setFeedback({ type: "error", message: err.message || "Erreur de création" });
        }
    };

    const handleEditSuccess = () => {
        setEditingItem(null);
        fetchItems();
    };

    const handleDeleteRequest = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item) setDeletingItem(item);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingItem) return;
        setIsDeleting(true);
        try {
            await logiqueInterventionService.delete(deletingItem.id);
            toast.success("Logique d'intervention supprimée !");
            setDeletingItem(null);
            fetchItems();
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de la suppression");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="space-y-12">
                <div>
                    <LogiqueInterventionCreateForm onSubmit={handleCreate} feedback={feedback} />
                </div>

                <div>
                    <LogiqueInterventionList
                        items={items}
                        isLoading={isLoading}
                        onEdit={setEditingItem}
                        onDelete={handleDeleteRequest}
                    />
                </div>
            </div>

            {editingItem && (
                <LogiqueInterventionEditModal
                    item={editingItem}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setEditingItem(null)}
                />
            )}

            {deletingItem && (
                <LogiqueInterventionDeleteModal
                    item={deletingItem}
                    isDeleting={isDeleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => !isDeleting && setDeletingItem(null)}
                />
            )}
        </>
    );
};
