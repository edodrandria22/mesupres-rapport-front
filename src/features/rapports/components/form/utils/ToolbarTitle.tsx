import React from "react";
import { ToolbarTitleProps } from "@/features/rapports/types/utils/utilsType";
export const ToolbarTitle = ({ title, description }: ToolbarTitleProps) => {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
        {title}
      </h1>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        {description}
      </p>
    </div>
  );
};