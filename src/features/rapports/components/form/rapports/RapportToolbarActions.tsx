import React from "react";
import { RapportToolbarActionsProps } from "@/features/rapports/types/rapports/rapportsType";

export const RapportToolbarActions = ({
  isPdfGenerating,
  onPreviewPdf,
  isSubmitting,
  periodeValue,
}: RapportToolbarActionsProps) => {
  const isPreviewDisabled = isPdfGenerating || !periodeValue;
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPreviewDisabled}
        onClick={onPreviewPdf}
        title={!periodeValue ? "Veuillez sélectionner une période" : undefined}
        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
      >
        {isPdfGenerating ? "Génération..." : "Aperçu PDF"}
      </button>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
      >
        {isSubmitting ? "Traitement..." : "Enregistrer"}
      </button>
    </div>
  );
};