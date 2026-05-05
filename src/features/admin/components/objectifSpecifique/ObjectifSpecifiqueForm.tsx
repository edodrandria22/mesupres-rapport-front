"use client";

import React, { useEffect, useState, useCallback } from "react";
import { objectifSpecifiqueService } from "@/features/admin/services/objectifSpecifiqueService";
import { ObjectifSpecifique, ObjectifSpecifiqueFormValues } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { ObjectifSpecifiqueCreateForm } from "./form/ObjectifSpecifiqueCreateForm";
import { ObjectifSpecifiqueList } from "./liste/ObjectifSpecifiqueList";
import { ObjectifSpecifiqueEditModal } from "./ObjectifSpecifiqueEditModal";
import { ObjectifSpecifiqueDeleteModal } from "./ObjectifSpecifiqueDeleteModal";
import toast from "react-hot-toast";

export const ObjectifSpecifiqueForm = () => {
    const [items, setItems] = useState<ObjectifSpecifique[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [editingItem, setEditingItem] = useState<ObjectifSpecifique | null>(null);
    const [deletingItem, setDeletingItem] = useState<ObjectifSpecifique | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await objectifSpecifiqueService.getAll();
            setItems(data);
        } catch {
            toast.error("Erreur lors du chargement des objectifs spécifiques");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCreate = async (data: ObjectifSpecifiqueFormValues, resetForm: () => void) => {
        setFeedback(null);
        try {
            await objectifSpecifiqueService.create(data.nom);
            resetForm();
            setFeedback({ type: "success", message: "Objectif spécifique créé avec succès !" });
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
            await objectifSpecifiqueService.delete(deletingItem.id);
            toast.success("Objectif spécifique supprimé !");
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
                    <ObjectifSpecifiqueCreateForm onSubmit={handleCreate} feedback={feedback} />
                </div>

                <div>
                    <ObjectifSpecifiqueList
                        items={items}
                        isLoading={isLoading}
                        onEdit={setEditingItem}
                        onDelete={handleDeleteRequest}
                    />
                </div>
            </div>

            {editingItem && (
                <ObjectifSpecifiqueEditModal
                    item={editingItem}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setEditingItem(null)}
                />
            )}

            {deletingItem && (
                <ObjectifSpecifiqueDeleteModal
                    item={deletingItem}
                    isDeleting={isDeleting}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => !isDeleting && setDeletingItem(null)}
                />
            )}
        </>
    );
};