"use client";

import React from "react";

/**
 * Option pour le composant AppSelect.
 */
export interface AppSelectOption {
    id: string | number;
    label: string;
}

/**
 * Propriétés du composant AppSelect.
 */
interface AppSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: AppSelectOption[];
    onValueChange: (value: string) => void;
    isLoading?: boolean;
    className?: string;
}

/**
 * Composant Select Générique & Premium.
 * Intègre un état de chargement et un design soigné.
 */
export const AppSelect: React.FC<AppSelectProps> = ({
    label,
    options,
    onValueChange,
    value,
    isLoading = false,
    className = "",
    disabled,
    ...props
}) => {
    return (
        <div className={`relative group ${className}`}>
            {label && (
                <label className="absolute -top-2 left-3 px-1.5 bg-white text-[9px] font-bold text-slate-400/80 uppercase tracking-widest z-10 transition-colors group-focus-within:text-blue-500">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    disabled={disabled || isLoading}
                    className={`
                        w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 
                        text-xs font-semibold text-slate-700 
                        appearance-none cursor-pointer outline-none transition-all duration-200
                        hover:border-slate-300 hover:bg-slate-50/30
                        focus:border-blue-400 focus:ring-4 focus:ring-blue-50/50 
                        disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
                        shadow-sm
                    `}
                    {...props}
                >
                    {isLoading ? (
                        <option value="">Chargement...</option>
                    ) : (
                        options.map((opt) => (
                            <option key={opt.id} value={opt.id} className="py-2">
                                {opt.label}
                            </option>
                        ))
                    )}
                </select>

                {/* Custom Modern Arrow Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-2">
                    {isLoading && (
                        <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
