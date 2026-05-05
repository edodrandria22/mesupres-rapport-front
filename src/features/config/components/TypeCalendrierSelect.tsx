"use client";

import React from "react";
import { AppSelect } from "@/features/common/components/ui/AppSelect";
import { useTypeCalendriers } from "../hooks/useTypeCalendriers";

interface TypeCalendrierSelectProps {
    value?: string | number;
    onValueChange: (value: string) => void;
    label?: string;
    className?: string;
}

export const TypeCalendrierSelect: React.FC<TypeCalendrierSelectProps> = ({
    value,
    onValueChange,
    label = "",
    className = "",
}) => {
    const { data, isLoading, error } = useTypeCalendriers();

    const options = [
        { id: "", label: "Choisir un type..." },
        ...data.map((type) => ({
            id: type.id ?? "",
            label: type.name,
        }))
    ];

    if (error) {
        return (
            <div className={`text-xs text-red-500 p-2 border border-red-100 rounded bg-red-50 ${className}`}>
                Erreur: {error}
            </div>
        );
    }

    return (
        <AppSelect
            label={label}
            options={options}
            value={value}
            onValueChange={onValueChange}
            isLoading={isLoading}
            className={className}
        />
    );
};
