"use client";

import { ObjectifSpecifiqueForm } from "@/features/admin/components/objectifSpecifique/ObjectifSpecifiqueForm";

export default function ObjectifsSpecifiquesPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">Administration</span>
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Objectifs Spécifiques</h1>
                </div>
            </div>
            <ObjectifSpecifiqueForm />
        </div>
    );
}
