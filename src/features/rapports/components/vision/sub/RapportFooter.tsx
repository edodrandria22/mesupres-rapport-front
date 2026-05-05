"use client";

import React from "react";
import { ApiRapport } from "../../../types";

interface RapportFooterProps {
    rapport: ApiRapport;
}

export const RapportFooter: React.FC<RapportFooterProps> = ({ rapport }) => {
    const agentName = rapport.user?.email?.split('@')[0] || "L'Agent";

    return (
        <div className="w-full flex justify-between items-start mt-12 px-10 pb-8">
            {/* Agent Signature */}
            <div className="text-center space-y-2">
                <p
                    className="text-[11px] font-black uppercase tracking-widest pl-1 border-l-2"
                    style={{ color: "#94a3b8", borderColor: "#0f172a" }}
                >
                    L'Agent
                </p>
                <div className="h-16" /> {/* Spacer for physical signature */}
                <div className="border-t-2 pt-3" style={{ borderColor: "#0f172a" }}>
                    <p className="text-xs font-black uppercase tracking-wider" style={{ color: "#0f172a" }}>
                        {agentName}
                    </p>
                </div>
            </div>

            {/* Superior Signature */}
            <div className="text-center space-y-2">
                <p
                    className="text-[11px] font-black uppercase tracking-widest pl-1 border-l-2"
                    style={{ color: "#94a3b8", borderColor: "#0f172a" }}
                >
                    Le Directeur / Chef de Service
                </p>
                <div className="h-16" />
                <div className="border-t-2 pt-3 px-8" style={{ borderColor: "#0f172a" }}>
                    <p className="text-xs font-black uppercase tracking-wider italic" style={{ color: "#64748b" }}>
                        Cachet et Signature
                    </p>
                </div>
            </div>
        </div>
    );
};
