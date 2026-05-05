import { CalendrierResult } from "../calendrier/calendrierType";

export interface ToolbarTitleProps {
  title: string;
  description: string;
}

export interface ToolbarSelectsProps {
  selectedTypeId: string;
  onTypeChange: (val: string) => void;
  periodeValue: string;
  onPeriodeChange: (val: string) => void;
  calendrierResult: CalendrierResult;
}