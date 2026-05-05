import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeCalendrierSelect } from "@/features/config/components/TypeCalendrierSelect";
import { periodSchema, PeriodFormValues } from "@/features/admin/type/period/periodSchema";

interface PeriodCreateFormProps {
    onSubmit: (data: PeriodFormValues, reset: () => void) => Promise<void>;
    feedback: { type: "success" | "error"; message: string } | null;
}

export const PeriodCreateForm = ({ onSubmit, feedback }: PeriodCreateFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitting, isValid }
    } = useForm<PeriodFormValues>({
        resolver: zodResolver(periodSchema),
        defaultValues: { debut: "", fin: "", typeCalendrierId: "" },
        mode: "onChange"
    });

    const typeCalendrierId = watch("typeCalendrierId");

    return (
        <form onSubmit={handleSubmit((data) => onSubmit(data, reset))} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
            {feedback && (
                <div className={`p-4 rounded-lg text-xs font-bold uppercase tracking-widest border ${feedback.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-500"}`}>
                    {feedback.message}
                </div>
            )}

            <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date de début</label>
                <input type="date" {...register("debut", { onChange: () => trigger("fin") })} className="w-full border rounded-lg px-4 py-3 text-sm border-slate-200 bg-white text-slate-900 outline-none focus:border-slate-300 focus:bg-slate-50" />
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date de fin</label>
                <input type="date" {...register("fin")} className={`w-full border rounded-lg px-4 py-3 text-sm outline-none ${errors.fin ? "border-red-400 bg-red-50 text-red-900" : "border-slate-200 bg-white text-slate-900 focus:border-slate-300 focus:bg-slate-50"}`} />
                {errors.fin && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.fin.message}</p>}
            </div>

            <div className="space-y-3">
                <TypeCalendrierSelect value={typeCalendrierId} onValueChange={(val) => setValue("typeCalendrierId", val, { shouldValidate: true })} />
            </div>

            <button type="submit" disabled={isSubmitting || !isValid} className="w-full py-3.5 bg-slate-900 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg disabled:opacity-50 active:scale-[0.98] transition-transform">
                {isSubmitting ? "Enregistrement..." : "Créer la période"}
            </button>
        </form>
    );
};