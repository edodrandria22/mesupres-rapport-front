import React, { useEffect } from "react";
import { useFieldArray, UseFormSetValue, useWatch } from "react-hook-form";
import { ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";

interface LigneActiviteProps {
  control: any;
  register: any;
   setValue: UseFormSetValue<any>;    
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
  isTrimestriel?: boolean;
  objectifSpecifiques?: ObjectifSpecifique[];
  logiqueInterventions?: LogiqueIntervention[];
  gridLayout: string;
  isSupervision?: boolean;

}

export const LigneActiviteEditor = ({
  control,
  register,
  setValue,
  index,
  remove,
  canRemove,
  isTrimestriel = false,
  objectifSpecifiques = [],
  logiqueInterventions = [],
  gridLayout,
  isSupervision = false
}: LigneActiviteProps) => {
  
  // --- Hooks pour tous les champs ---
  const { fields: effectsFields, append: appendEffect, remove: removeEffect } = useFieldArray({ control, name: `lignes.${index}.effects` });
  const { fields: impactsFields, append: appendImpact, remove: removeImpact } = useFieldArray({ control, name: `lignes.${index}.impacts` });
  const { fields: produitsFields, append: appendProduit, remove: removeProduit } = useFieldArray({ control, name: `lignes.${index}.produits` });
  const { fields: ciblesFields, append: appendCible, remove: removeCible } = useFieldArray({ control, name: `lignes.${index}.cibles` });
  const { fields: previsionsFields, append: appendPrevision, remove: removePrevision } = useFieldArray({ control, name: `lignes.${index}.previsions` });
  const { fields: realisationsFields, append: appendRealisation, remove: removeRealisation } = useFieldArray({ control, name: `lignes.${index}.realisations` });
  const { fields: tauxFields, append: appendTaux } = useFieldArray({ control, name: `lignes.${index}.taux` });
  const { fields: observationsFields, append: appendObservation, remove: removeObservation } = useFieldArray({ control, name: `lignes.${index}.observations` });

  // Sécurité pour s'assurer qu'il y a toujours au moins un champ vide par colonne
  useEffect(() => {
    if (effectsFields.length === 0) appendEffect({ value: "" });
    if (impactsFields.length === 0) appendImpact({ value: "" });
    if (isTrimestriel) {
      if (produitsFields.length === 0) appendProduit({ value: "" });
      if (ciblesFields.length === 0) appendCible({ value: "" });
      if (previsionsFields.length === 0) appendPrevision({ value: "" });
      if (realisationsFields.length === 0) appendRealisation({ value: "" });
      if (tauxFields.length === 0) appendTaux({ value: "" });
      if (observationsFields.length === 0) appendObservation({ value: "" });
    }
  }, [
    effectsFields.length, impactsFields.length, produitsFields.length, ciblesFields.length, 
    previsionsFields.length, realisationsFields.length, tauxFields.length, observationsFields.length, 
    isTrimestriel, appendEffect, appendImpact, appendProduit, appendCible, appendPrevision, 
    appendRealisation, appendTaux, appendObservation
  ]);

  // --- Calcul automatique du taux (comme dans LigneActivite) ---
  const previsionsWatch = useWatch({ control, name: `lignes.${index}.previsions` });
  const realisationsWatch = useWatch({ control, name: `lignes.${index}.realisations` });
  const objectifSpecifiqueWatch = useWatch({ control, name: `lignes.${index}.titre` });

  const calculerTaux = (i: number) => {
    // Si c'est "Hors PTA", on retourne directement cette valeur
    if (objectifSpecifiqueWatch === "Hors PTA") {
      return "Hors PTA";
    }
    
    const prev = parseFloat(previsionsWatch?.[i]?.value) || 0;
    const real = parseFloat(realisationsWatch?.[i]?.value) || 0;
    if (prev <= 0) return "0.00";
    if (real === 0) return "0.00";
    return ((real / prev) * 100).toFixed(2);
  };

  // Effet pour mettre à jour tous les champs quand l'objectif spécifique change
  useEffect(() => {
    if (objectifSpecifiqueWatch === "Hors PTA") {
      // Mettre à jour tous les champs avec "Hors PTA"
      effectsFields.forEach((_, i) => {
        setValue(`lignes.${index}.effects.${i}.value`, "Hors PTA");
      });
      ciblesFields.forEach((_, i) => {
        setValue(`lignes.${index}.cibles.${i}.value`, "Hors PTA");
      });
      previsionsFields.forEach((_, i) => {
        setValue(`lignes.${index}.previsions.${i}.value`, "Hors PTA");
      });
      realisationsFields.forEach((_, i) => {
        setValue(`lignes.${index}.realisations.${i}.value`, "Hors PTA");
      });
      tauxFields.forEach((_, i) => {
        setValue(`lignes.${index}.taux.${i}.value`, "Hors PTA");
      });
    }
  }, [objectifSpecifiqueWatch, index, setValue, effectsFields, ciblesFields, previsionsFields, realisationsFields, tauxFields]);

  useEffect(() => {
    tauxFields.forEach((_, i) => {
      setValue(`lignes.${index}.taux.${i}.value`, calculerTaux(i));
    });
  }, [previsionsWatch, realisationsWatch, objectifSpecifiqueWatch, setValue]);

  // --- Grille dynamique synchronisée avec le parent ---
 

  // --- Classes CSS communes pour éviter la répétition ---
  const colContainerClass = "border-l border-slate-100 p-4 space-y-3 w-full h-full flex flex-col";
  const itemBoxClass = "flex items-center gap-2 bg-white p-3 border border-slate-200 rounded-lg shadow-sm w-full relative group/item"; 
  const textAreaClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 resize-none min-h-[100px] p-2 placeholder:text-slate-300 text-center placeholder:text-center flex items-center justify-center";
  const selectClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 p-2 cursor-pointer text-center";
  const inputClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 min-h-[100px] p-2 placeholder:text-slate-300 text-center placeholder:text-center flex items-center justify-center";
  const addBtnClass = "w-full py-2 mt-auto border border-dashed border-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all";
  const closeBtnClass = "text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50";

  return (
    <div className={`grid ${gridLayout} group/row transition-colors hover:bg-slate-50/30 items-stretch`}>
      
      {/* 1. Index */}
      <div className="flex items-center justify-center text-xs font-black text-slate-300 bg-slate-50/20">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* 2. Titre Activité */}
      <div className={colContainerClass}>
        <div className={itemBoxClass}>
          {isTrimestriel ? (
            isSupervision ? (
              <textarea
                {...register(`lignes.${index}.titre`)}
                className={`${textAreaClass} font-bold text-slate-800 h-full pointer-events-none bg-slate-50`}
                placeholder="Objectif spécifique"
                readOnly
              />
            ) : (
              <select
                {...register(`lignes.${index}.titre`)}
                className={`${selectClass} font-bold text-slate-800`}
              >
                <option value="">Sélectionner un objectif...</option>
                <option value="Hors PTA">Hors PTA</option>
                {objectifSpecifiques.map((obj: ObjectifSpecifique) => (
                  <option key={obj.id} value={obj.nom}>{obj.nom}</option>
                ))}
              </select>
            )
          ) : (
            <textarea
              {...register(`lignes.${index}.titre`)}
              className={`${textAreaClass} font-bold text-slate-800 h-full`}
              placeholder="Nom de l'activité..."
            />
          )}
        </div>
      </div>

      {/* 3. Effets (Activité / Logique d'intervention) */}
      <div className={colContainerClass}>
        {effectsFields.map((field, i) => (
          <div key={field.id} className={itemBoxClass}>
            {isTrimestriel ? (
              isSupervision ? (
                <textarea
                  {...register(`lignes.${index}.effects.${i}.value`)}
                  className={`${textAreaClass} h-full pointer-events-none bg-slate-50`}
                  placeholder="Logique d'intervention"
                  readOnly
                />
              ) : (
                <>
                  {objectifSpecifiqueWatch === "Hors PTA" ? (
                    <input
                      type="text"
                      {...register(`lignes.${index}.effects.${i}.value` as any, { value: "Hors PTA" })}
                      className={inputClass}
                      readOnly
                    />
                  ) : (
                    <select
                      {...register(`lignes.${index}.effects.${i}.value`)}
                      className={selectClass}
                    >
                      <option value="">Sélectionner une logique d'intervention...</option>
                      {logiqueInterventions.map((logique: LogiqueIntervention) => (
                        <option key={logique.id} value={logique.nom}>{logique.nom}</option>
                      ))}
                    </select>
                  )}
                </>
              )
            ) : (
              <textarea
                {...register(`lignes.${index}.effects.${i}.value`)}
                className={textAreaClass}
                placeholder={`Effet ${i + 1}...`}
              />
            )}
            {effectsFields.length > 1 && (
              <button type="button" onClick={() => removeEffect(i)} className={closeBtnClass}>✕</button>
            )}
          </div>
        ))}
        {!isTrimestriel && (
          <button type="button" onClick={() => appendEffect({ value: "" })} className={addBtnClass}>
            + effet
          </button>
        )}
      </div>

      {/* 4. Impacts (Activité PTA) */}
      <div className={colContainerClass}>
        {impactsFields.map((field, i) => (
          <div key={field.id} className={itemBoxClass}>
            <textarea
              {...register(`lignes.${index}.impacts.${i}.value`)}
              className={textAreaClass}
              placeholder={isTrimestriel ? `Activité PTA ${i + 1}...` : `Impact ${i + 1}...`}
            />
            {impactsFields.length > 1 && (
              <button type="button" onClick={() => removeImpact(i)} className={closeBtnClass}>✕</button>
            )}
        
          </div>
        ))}
        {/* <button type="button" onClick={() => appendImpact({ value: "" })} className={addBtnClass}>
          + {isTrimestriel ? "activité PTA" : "impact"}
        </button> */}
        {!isTrimestriel && (
          <button type="button" onClick={() => appendImpact({ value: "" })} className={addBtnClass}>
            + impact
          </button>
        )}
      </div>

      {/* COLONNES TRIMESTRIELLES */}
      {isTrimestriel && (
        <>
          {/* 5. Produits */}
          <div className={colContainerClass}>
            {produitsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                <input type="text" {...register(`lignes.${index}.produits.${i}.value`)} className={inputClass} placeholder={`Produit ${i + 1}...`} required />
                {produitsFields.length > 1 && <button type="button" onClick={() => removeProduit(i)} className={closeBtnClass}>✕</button>}
              </div>
            ))}
            {/* <button type="button" onClick={() => appendProduit({ value: "" })} className={addBtnClass}>+ produit</button> */}
          </div>

          {/* 6. Cibles */}
          <div className={colContainerClass}>
            {ciblesFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                {objectifSpecifiqueWatch === "Hors PTA" ? (
                  <input
                    type="text"
                    {...register(`lignes.${index}.cibles.${i}.value` as any, { value: "Hors PTA" })}
                    className={inputClass}
                    readOnly
                  />
                ) : (
                  <input type="number" {...register(`lignes.${index}.cibles.${i}.value`)} className={inputClass} placeholder={`Cible ${i + 1}...`} min="1" />
                )}
                {ciblesFields.length > 1 && <button type="button" onClick={() => removeCible(i)} className={closeBtnClass}>✕</button>}
              </div>
            ))}
            {/* <button type="button" onClick={() => appendCible({ value: "" })} className={addBtnClass}>+ cible</button> */}
          </div>

          {/* 7. Prévisions */}
          <div className={colContainerClass}>
            {previsionsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                {objectifSpecifiqueWatch === "Hors PTA" ? (
                  <input
                    type="text"
                    {...register(`lignes.${index}.previsions.${i}.value` as any, { value: "Hors PTA" })}
                    className={inputClass}
                    readOnly
                  />
                ) : (
                  <input 
                    type="number"
                    {...register(`lignes.${index}.previsions.${i}.value`)} 
                    className={inputClass} 
                    placeholder={`Prévision ${i + 1}...`}
                  />
                )}
                {previsionsFields.length > 1 && <button type="button" onClick={() => removePrevision(i)} className={closeBtnClass}>✕</button>}
              </div>
            ))}
            {/* <button type="button" onClick={() => appendPrevision({ value: "" })} className={addBtnClass}>+ prévision</button> */}
          </div>

          {/* 8. Réalisations */}
          <div className={colContainerClass}>
            {realisationsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                {objectifSpecifiqueWatch === "Hors PTA" ? (
                  <input
                    type="text"
                    {...register(`lignes.${index}.realisations.${i}.value` as any, { value: "Hors PTA" })}
                    className={inputClass}
                    readOnly
                  />
                ) : (
                  <input 
                    type="number"
                    {...register(`lignes.${index}.realisations.${i}.value`)} 
                    className={inputClass} 
                    placeholder={`Réalisation ${i + 1}...`}
                  />
                )}
                {realisationsFields.length > 1 && <button type="button" onClick={() => removeRealisation(i)} className={closeBtnClass}>✕</button>}
              </div>
            ))}
            {/* <button type="button" onClick={() => appendRealisation({ value: "" })} className={addBtnClass}>+ réalisation</button> */}
          </div>

          {/* 9. Taux (calculé automatiquement, non modifiable) */}
          <div className={colContainerClass}>
            {tauxFields.map((field, i) => {
              const valeurTaux = calculerTaux(i);
              return (
                <div key={field.id} className={`${itemBoxClass} bg-slate-50 border-blue-100`}>
                  <input
                    type="text"
                    {...register(`lignes.${index}.taux.${i}.value`)}
                    value={valeurTaux}
                    readOnly
                    className={`${textAreaClass} font-bold text-blue-600 pointer-events-none`}
                  />
                  {valeurTaux !== "Hors PTA" && (
                    <span className="text-[10px] font-bold text-blue-400 absolute right-2 top-1/2 transform -translate-y-1/2">%</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 10. Observations */}
          <div className={colContainerClass}>
            {observationsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                <textarea {...register(`lignes.${index}.observations.${i}.value`)} className={textAreaClass} placeholder={`Observation ${i + 1}...`} />
                {observationsFields.length > 1 && <button type="button" onClick={() => removeObservation(i)} className={closeBtnClass}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => appendObservation({ value: "" })} className={addBtnClass}>+ observation</button>
          </div>
        </>
      )}

      {/* 11. Bouton Supprimer (Global) */}
      <div className="border-l border-slate-100 flex items-center justify-center p-3">
        <button
          type="button"
          onClick={() => remove(index)}
          disabled={!canRemove}
          className="p-2.5 rounded-full transition-all text-red-300 bg-red-50 opacity-100 md:text-slate-300 md:bg-transparent md:opacity-0 md:hover:text-red-500 md:hover:bg-red-50 md:group-hover/row:opacity-100 disabled:invisible"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

    </div>
  );
};