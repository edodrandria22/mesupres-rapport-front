"use client";

import React from "react";
import { ApiRapport } from "../../types";
import { RapportHeader } from "./sub/RapportHeader";
import { RapportTable } from "./sub/RapportTable";
// import { RapportFooter } from "./sub/RapportFooter";

interface RapportViewProps {
    data: ApiRapport[];
    isPrintMode?: boolean;
    isPdf?: boolean;
    isLandscape?: boolean;
}

export const RapportView: React.FC<RapportViewProps> = ({
    data,
    isPrintMode = false,
    isPdf = true,
    isLandscape = false,
}) => {
    if (!data || data.length === 0) return null;

    const pageWidth = isLandscape ? "297mm" : "210mm";
    const pageHeight = isLandscape ? "210mm" : "297mm";

    // Appliquer un scale pour le mode paysage afin d'éviter les pages multiples

    return (
        <div
            className="w-full flex justify-center"
            style={{
                paddingTop: isPrintMode ? "0" : "64px",
                paddingBottom: isPrintMode ? "0" : "64px",
                backgroundColor: isPrintMode ? "#ffffff" : "#f8fafc"
            }}
        >
            <div
                id="unified-report-content"
                className="bg-white font-sans text-[12px]"
                style={{
                    width: pageWidth,
                    minHeight: pageHeight,
                    padding: "15mm 12mm",
                    boxSizing: "border-box",
                    color: "#000000",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "40px",
                    // Use standard shadow to avoid modern color function issues
                    boxShadow: isPrintMode ? "none" : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    border: isPrintMode ? "none" : "1px solid #e2e8f0"
                }}
            >
                {/* 1. Header (Affiché une seule fois au début) */}
                {isPdf && <RapportHeader />}

                {/* 2. Flux de Tableaux (Enchaînement sans saut de page forcé) */}
                <div className="flex flex-col gap-10">
                    {data.map((rapport, index) => (
                        <div key={rapport.id || index} className="w-full" data-report-section>
                            <RapportTable rapport={rapport} isPdf={isPdf} />
                        </div>
                    ))}
                </div>

                {/* 3. Footer (Affiché une seule fois à la fin) */}
                {/* <div style={{ marginTop: "auto", paddingTop: "40px" }}>
                    <RapportFooter rapport={data[data.length - 1]} />
                </div> */}

                {/* Print Styles for stability */}
                <style jsx global>{`
                    @media print {
                        body {
                            background: white !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        #unified-report-content {
                            box-shadow: none !important;
                            border: none !important;
                            padding: 10mm !important; /* Adjust for physical print margins */
                            margin: 0 !important;
                            width: 100% !important;
                        }
                        tr {
                            break-inside: avoid;
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};