"use client";

import React from "react";

/**
 * Propriétés du composant AppTableSkeleton.
 */
interface AppTableSkeletonProps {
    rows?: number;
    cols?: number;
    className?: string;
}

/**
 * Composant de chargement squelettique pour les tableaux.
 * Offre un effet de balayage (shimmer) premium et personnalisable.
 */
export const AppTableSkeleton: React.FC<AppTableSkeletonProps> = ({
    rows = 5,
    cols = 4,
    className = "",
}) => {
    return (
        <div className={`w-full bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm animate-pulse ${className}`}>
            <table className="w-full border-collapse">
                {/* Header Skeleton */}
                <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                        {Array.from({ length: cols }).map((_, i) => (
                            <th key={`head-${i}`} className="px-6 py-4">
                                <div className="h-3 bg-slate-200 rounded-full w-2/3 mx-auto" />
                            </th>
                        ))}
                    </tr>
                </thead>

                {/* Body Skeleton */}
                <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr 
                    key={`row-${rowIndex}`} 
                    className="border-b border-slate-50/80 last:border-0 hover:bg-slate-50/20 transition-colors"
                    >
                    {Array.from({ length: cols }).map((_, colIndex) => {
                        // Logique déterministe : on crée une largeur entre 40% et 90% 
                        // basée sur les index pour éviter le conflit serveur/client.
                        const widthValue = 40 + ((rowIndex * 7 + colIndex * 13) % 51);
                        
                        return (
                        <td key={`cell-${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                            <div
                            className="h-2.5 bg-slate-100 rounded-full animate-pulse" // Ajout de animate-pulse pour l'effet skeleton
                            style={{
                                width: `${widthValue}%`,
                                margin: "0 auto"
                            }}
                            />
                        </td>
                        );
                    })}
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Shimmer effect overlay layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite] -translate-x-[100%]" />
            </div>
        </div>
    );
};
