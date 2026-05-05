"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useForm, useFieldArray, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// Imports séparés
import { rapportSchema, RapportFormValues } from "../../types/rapport";
import { RapportToolbar } from "./rapports/RapportToolbar";
import { RapportView } from "../vision/RapportView";
import { ApiRapport } from "../../types";
import { usePdfExport } from "../../hooks/usePdfExport";
import { usePeriodes } from "@/features/config/hooks/usePeriodes";
import { useUser } from "@/features/auth/contexts/UserContext";
import { rapportService } from "@/features/rapports/services/rapportService";
import { toast } from "react-hot-toast";
import { audioService } from "@/hooks/audioService";

// 👇 Import du nouveau composant
import TableauActivites from "./TableauActivite";
import { ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";
import { objectifSpecifiqueService } from "@/features/admin/services/objectifSpecifiqueService";
import { logiqueInterventionService } from "@/features/admin/services/logiqueInterventionService";

export const ConsolidationForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const { exportToPdf, isGenerating: isPdfGenerating } = usePdfExport();

  // 👇 MODIFICATION ICI : On vérifie si l'ID sélectionné est "3"
  const isTrimestriel = selectedTypeId === "3" || selectedTypeId === "4"; 

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<RapportFormValues>({
    resolver: zodResolver(rapportSchema),
    defaultValues: {
      idCalendrier: undefined,
      lignes: [{ titre: "", effects: [{ value: "" }], impacts: [{ value: "" }], statut: "TERMINE" }],
    },
  });
  const [objectifSpecifiques, setObjectifSpecifiques] = useState<ObjectifSpecifique[]>([]);
  const [logiqueInterventions, setLogiqueInterventions] = useState<LogiqueIntervention[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "lignes" });
  const calendrierResult = usePeriodes(true);
  const watchedValues = watch();

  const {user} = useUser();
  const rapportPreview = useMemo<ApiRapport>(() => {
    const selectedCalendrier = calendrierResult.data?.find(
      (c) => c.id === Number(watchedValues.idCalendrier)
    );

    return {
      id: 0,
      idCalendrier: Number(watchedValues.idCalendrier),
      // Si selectedCalendrier est undefined, on fournit un objet vide ou par défaut
      calendrier: selectedCalendrier || {
        id: Number(watchedValues.idCalendrier) || 0,
        dateDebut: "Non définie",
        dateFin: "Non définie",
        typeCalendrier: { id: Number(selectedTypeId) || undefined, name: "" }
      },
      user: user || { id: 0, email: "utilisateur@system.mg", entite: "VOTRE DIRECTION", role: "Admin" } as any,
      activites: watchedValues.lignes.map(l => ({
        activite: {
          name: l.titre
        },
        effects: l.effects
          ?.filter(e => e.value && e.value.trim() !== "")
          .map(e => ({ name: e.value })) || [],

        impacts: l.impacts
          ?.filter(i => i.value && i.value.trim() !== "")
          .map(i => ({ name: i.value })) || [],
        produits: l.produits
          ?.filter(p => p.value && p.value.trim() !== "")
          .map(p => ({ name: p.value })) || [],
        cibles: l.cibles
          ?.filter(c => c.value && c.value.trim() !== "")
          .map(c => ({ name: c.value })) || [],
        previsions: l.previsions
          ?.filter(p => p.value && p.value.trim() !== "")
          .map(p => ({ name: p.value })) || [],
        realisations: l.realisations
          ?.filter(r => r.value && r.value.trim() !== "")
          .map(r => ({ name: r.value })) || [],
        taux: l.taux
          ?.filter(t => t.value && t.value.trim() !== "")
          .map(t => ({ name: t.value })) || [],
        observations: l.observations
          ?.filter(o => o.value && o.value.trim() !== "")
          .map(o => ({ name: o.value })) || [],
      })),
      statut: "BROUILLON"
    };
  }, [watchedValues, calendrierResult.data, user, selectedTypeId]);

  const onSubmit = async (data: RapportFormValues) => {
    setIsSubmitting(true);
    try {
      await rapportService.saveRapport(rapportPreview);
      toast.success("Rapport enregistré avec succès !");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement du rapport.");
    } finally {
      setIsSubmitting(false);
    }
  };
      const fetchItems = useCallback(async () => {
          setIsLoading(true);
          try {
              const OS = await objectifSpecifiqueService.getAll();
              setObjectifSpecifiques(OS);
              const LI = await logiqueInterventionService.getAll();
              setLogiqueInterventions(LI);
          } catch {
              toast.error("Erreur lors du chargement des objectifs spécifiques");
          } finally {
              setIsLoading(false);
          }
      }, []);
  
      useEffect(() => {
          // Ne charger les listes OS/LI qu'une seule fois si mode trimestriel
          if (isTrimestriel && objectifSpecifiques.length === 0 && logiqueInterventions.length === 0) {
            fetchItems();
          }
        }, [fetchItems, isTrimestriel, objectifSpecifiques.length, logiqueInterventions.length]);

  const onInvalid = (errors: any) => {
    const champsManquants = Object.keys(errors).join(", ");
    audioService.playErrorValidation();

    toast.error(`Le formulaire est incomplet. Champs manquants : ${champsManquants}`, {
      duration: 4000,
      position: "top-center",
    });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-10 max-w-6xl mx-auto pb-20">

      <RapportToolbar
        selectedTypeId={selectedTypeId}
        onTypeChange={(val) => {
          setSelectedTypeId(val);
          setValue("idCalendrier", undefined as any);
        }}
        periodeValue={watchedValues.idCalendrier?.toString() || ""}
        onPeriodeChange={(val) => setValue("idCalendrier", Number(val), { shouldValidate: true })}
        isPdfGenerating={isPdfGenerating}
        onPreviewPdf={() => exportToPdf("pdf-render-zone", "Apercu_Rapport.pdf", isTrimestriel)}
        isSubmitting={isSubmitting}
        calendrierResult={calendrierResult}
      />

      {/* 👇 Le tableau s'adaptera automatiquement si selectedTypeId vaut "3" */}
      <TableauActivites 
        fields={fields}
        control={control}
        register={register}
        remove={remove}
        isTrimestriel={Number(selectedTypeId)}
        objectifSpecifiques={objectifSpecifiques}
        logiqueInterventions={logiqueInterventions}
        setValue={setValue}
      />

      <button
        type="button"
        onClick={() => append({
          titre: "",
          effects: [{ value: "" }],
          impacts: [{ value: "" }],
          produits: [{ value: "" }],
          cibles: [{ value: "" }],
          previsions: [{ value: "" }],
          taux: [{ value: "" }],
          observations: [{ value: "" }]
        })}
        className="w-full py-10 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-900 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
          <span className="text-xl font-light">+</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Ajouter une autre</span>
      </button>

      {/* Rendu PDF caché */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
        <div id="pdf-render-zone" style={{ width: isTrimestriel ? "210mm" : "210mm" }}>
          <RapportView data={[rapportPreview]} isPrintMode={true} isLandscape={isTrimestriel} />
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
          Veuillez remplir tous les champs obligatoires (Titre, Effets, Impacts et Période).
        </div>
      )}
    </form>
  );
};