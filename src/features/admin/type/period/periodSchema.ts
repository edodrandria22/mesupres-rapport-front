import * as z from "zod";

export const periodSchema = z.object({
    debut: z.string().min(1, "La date de début est requise"),
    fin: z.string().min(1, "La date de fin est requise"),
    typeCalendrierId: z.string().min(1, "Le type de calendrier est requis"),
}).refine((data) => new Date(data.debut).getTime() < new Date(data.fin).getTime(), {
    message: "Attention : La date de fin doit être strictement après la date de début.",
    path: ["fin"],
});

export type PeriodFormValues = z.infer<typeof periodSchema>;