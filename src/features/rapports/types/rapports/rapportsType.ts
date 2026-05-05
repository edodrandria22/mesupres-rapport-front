import { CalendrierResult } from "../calendrier/calendrierType";

export interface RapportToolbarActionsProps {
  isPdfGenerating: boolean;
  onPreviewPdf: () => void;
  isSubmitting: boolean;
  periodeValue: string;
}

export interface RapportToolbarProps {
  selectedTypeId: string;
  onTypeChange: (val: string) => void;
  periodeValue: string;
  onPeriodeChange: (val: string) => void;
  isPdfGenerating: boolean;
  onPreviewPdf: () => void;
  isSubmitting: boolean;
  calendrierResult: CalendrierResult;
}