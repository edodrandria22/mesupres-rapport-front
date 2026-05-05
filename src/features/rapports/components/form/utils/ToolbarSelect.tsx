import React from "react";
import { PeriodeSelect } from "@/features/config/components/PeriodeSelect";
import { TypeCalendrierSelect } from "@/features/config/components/TypeCalendrierSelect";
import { ToolbarSelectsProps } from "@/features/rapports/types/utils/utilsType";

export const ToolbarSelects = ({
  selectedTypeId,
  onTypeChange,
  periodeValue,
  onPeriodeChange,
  calendrierResult,
}: ToolbarSelectsProps) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full">
      {/* Select Type */}
      <div className="flex flex-col gap-1 w-full lg:w-auto lg:border-r lg:border-slate-100 lg:pr-6">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
          Type de calendrier
        </span>
        <TypeCalendrierSelect
          value={selectedTypeId}
          onValueChange={onTypeChange}
          className="min-w-[200px]"
        />
      </div>

      {/* Select Période */}
      <div className="flex flex-col gap-1 w-full lg:w-auto">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
          Période
        </span>
        <PeriodeSelect
          value={periodeValue}
          onValueChange={onPeriodeChange}
          typeCalendrierId={selectedTypeId}
          calendrierResult={calendrierResult}
          className="min-w-[280px]"
        />
      </div>
    </div>
  );
};