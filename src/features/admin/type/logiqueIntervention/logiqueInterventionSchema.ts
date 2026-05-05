import * as z from "zod";

export const logiqueInterventionSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
});

export type LogiqueInterventionFormValues = z.infer<typeof logiqueInterventionSchema>;

export interface LogiqueIntervention {
    id: number;
    nom: string;
}
