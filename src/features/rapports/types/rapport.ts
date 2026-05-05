import { z } from "zod";

export const rapportSchema = z.object({
  idCalendrier: z.number().optional(), // ou z.number({ required_error: "..." })
  lignes: z.array(
    z.object({
      titre: z.string().min(1, "Le titre est requis"),
      effects: z.array(z.object({ value: z.string() })),
      impacts: z.array(z.object({ value: z.string() })),
      statut: z.string().optional(),
      // 👇 Ajoute les nouveaux champs au schéma Zod en optionnel
      produits: z.array(z.object({ value: z.string() })).optional(),
      cibles: z.array(z.object({ value: z.string() })).optional(),
      previsions: z.array(z.object({ value: z.string() })).optional(),
      realisations: z.array(z.object({ value: z.string() })).optional(),
      taux: z.array(z.object({ value: z.string() })).optional(),
      observations: z.array(z.object({ value: z.string() })).optional(),
    })
  ),
});

export type RapportFormValues = z.infer<typeof rapportSchema>;