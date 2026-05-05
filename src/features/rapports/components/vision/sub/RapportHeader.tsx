"use client";

import React from "react";
import { IMAGES } from "@/config/constants";

interface RapportHeaderProps { }

export const RapportHeader: React.FC<RapportHeaderProps> = () => {
    return (
        <div className="w-full flex flex-col items-center text-center mt-0 pt-0 mb-1">

            {/* Emblème de la République */}
            <img
                src={IMAGES.LOGO_REPOBLIKA}
                alt="Emblème Repoblikan'i Madagasikara"
                crossOrigin="anonymous"
                className="w-32 h-auto object-contain"
            />

            {/* Séparateur */}
            <div className="w-16 border-t border-black my-1" />

            {/* Nom du ministère */}
            <p
                className="text-[10px] font-black uppercase leading-snug tracking-wide"
                style={{ color: "#0f172a" }}
            >
                Ministère de l&apos;Enseignement Supérieur et de la
            </p>
            <p
                className="text-[10px] font-black uppercase leading-snug tracking-wide"
                style={{ color: "#0f172a" }}
            >
                Recherche Scientifique
            </p>

            {/* Séparateur bas */}
            <div className="w-16 border-t border-black mt-2 mb-0" />

        </div>
    );
};
