import * as z from "zod";

export const objectifSpecifiqueSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
});

export type ObjectifSpecifiqueFormValues = z.infer<typeof objectifSpecifiqueSchema>;

export interface ObjectifSpecifique {
    id: number;
    nom: string;
}