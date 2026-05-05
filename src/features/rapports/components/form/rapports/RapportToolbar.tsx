import React from "react";
// Imports des sous-composants fraîchement créés
import { ToolbarTitle } from "../utils/ToolbarTitle";
import { ToolbarSelects } from "../utils/ToolbarSelect";
import { RapportToolbarActions } from "./RapportToolbarActions";
import { RapportToolbarProps } from "@/features/rapports/types/rapports/rapportsType";



export const RapportToolbar = ({
  selectedTypeId,
  onTypeChange,
  periodeValue,
  onPeriodeChange,
  isPdfGenerating,
  onPreviewPdf,
  isSubmitting,
  calendrierResult,
}: RapportToolbarProps) => {
  return (
    <div className="sticky top-0 bg-white/90 backdrop-blur-md z-30 py-6 mb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
      
      {/* 1. Le Titre */}
      <ToolbarTitle 
        title="Rapport" 
        description="Definition des activités" 
      />

      {/* Container Flex pour aligner correctement Selects et Boutons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        
        {/* 2. Les Selects */}
        <ToolbarSelects 
          selectedTypeId={selectedTypeId}
          onTypeChange={onTypeChange}
          periodeValue={periodeValue}
          onPeriodeChange={onPeriodeChange}
          calendrierResult={calendrierResult}
        />
        
        {/* 3. Les Actions */}
        <RapportToolbarActions
          isPdfGenerating={isPdfGenerating}
          onPreviewPdf={onPreviewPdf}
          isSubmitting={isSubmitting}
          periodeValue={periodeValue}
        />
        
      </div>
    </div>
  );
};