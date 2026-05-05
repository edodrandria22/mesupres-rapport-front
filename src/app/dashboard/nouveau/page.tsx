import React from "react";
import { ConsolidationForm } from "@/features/rapports/components/form/RapportForm";

/**
 * Page de création d'un nouveau rapport.
 * Le layout dashboard (Navbar + Footer) est appliqué via dashboard/layout.tsx.
 */
export default function NouveauRapportPage() {
    return (
        <div className="space-y-6">
            {/* <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Nouveau Rapport</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Saisissez les activités, effets et impacts de la semaine.
                </p>
            </div> */}
            <ConsolidationForm />
        </div>
    );
}
