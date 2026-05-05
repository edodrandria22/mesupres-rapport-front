import React, { useEffect } from "react";
import { useFieldArray, Control, UseFormRegister, useWatch, useFormContext, UseFormSetValue } from "react-hook-form";
import { ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";

interface LigneActiviteProps {
  control: Control<any>; // Remplace "any" par ton interface si besoin
  register: UseFormRegister<any>;
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
  isTrimestriel: boolean;
  objectifSpecifiques?: ObjectifSpecifique[];
  logiqueInterventions?: LogiqueIntervention[];
  setValue: UseFormSetValue<any>;  
  gridLayout: string;
}

export const LigneActivite = ({ control, register, index, remove, canRemove, isTrimestriel = false, objectifSpecifiques = [], logiqueInterventions = [], setValue, gridLayout }: LigneActiviteProps) => {
  // --- Hooks ---
  const { fields: effectsFields, append: appendEffect, remove: removeEffect } = useFieldArray({ control, name: `lignes.${index}.effects` as any });
  const { fields: impactsFields, append: appendImpact, remove: removeImpact } = useFieldArray({ control, name: `lignes.${index}.impacts` as any });
  const { fields: produitsFields, append: appendProduit, remove: removeProduit } = useFieldArray({ control, name: `lignes.${index}.produits` as any });
  const { fields: ciblesFields, append: appendCible, remove: removeCible } = useFieldArray({ control, name: `lignes.${index}.cibles` as any });
  const { fields: previsionsFields, append: appendPrevision, remove: removePrevision } = useFieldArray({ control, name: `lignes.${index}.previsions` as any });
  const { fields: realisationsFields, append: appendRealisation, remove: removeRealisation } = useFieldArray({ control, name: `lignes.${index}.realisations` as any });
  const { fields: tauxFields, append: appendTaux, remove: removeTaux } = useFieldArray({ control, name: `lignes.${index}.taux` as any });
  const { fields: observationsFields, append: appendObservation, remove: removeObservation } = useFieldArray({ control, name: `lignes.${index}.observations` as any });

  // Ajout par défaut d'une ligne vide si la liste est vide
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
    effectsFields.length, impactsFields.length, produitsFields.length, 
    ciblesFields.length, previsionsFields.length, realisationsFields.length, tauxFields.length, 
    observationsFields.length, isTrimestriel, 
    appendEffect, appendImpact, appendProduit, appendCible, 
    appendPrevision, appendTaux, appendObservation
  ]);
  
 
  // ... à l'intérieur de votre composant LigneActivite ...

  // On surveille les valeurs des prévisions et réalisations pour cet index précis
// ... à l'intérieur de votre composant LigneActivite ...

// On surveille les valeurs des prévisions et réalisations
  const previsionsWatch = useWatch({ control, name: `lignes.${index}.previsions` });
  const realisationsWatch = useWatch({ control, name: `lignes.${index}.realisations` });
  const objectifSpecifiqueWatch = useWatch({ control, name: `lignes.${index}.titre` });

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

  // Fonction pour calculer le taux pour une ligne i donnée
  const calculerTaux = (i: number) => {
    // Si c'est "Hors PTA", on retourne directement cette valeur
    if (objectifSpecifiqueWatch === "Hors PTA") {
      return "Hors PTA";
    }
    
    const prev = parseFloat(previsionsWatch?.[i]?.value) || 0;
    const real = parseFloat(realisationsWatch?.[i]?.value) || 0;
    
    if (prev <= 0) return "0.00";
    if (real === 0) {
      return "0.00";
    }
    return ((real/prev) * 100).toFixed(2);
  };
  
  useEffect(() => {
    tauxFields.forEach((_, i) => {
      const resultatCalcul = calculerTaux(i);
      
      // On force la mise à jour INTERNE du formulaire
      // C'est ce qui permet de récupérer la valeur au submit !
      setValue(`lignes.${index}.taux.${i}.value`, resultatCalcul);
    });
  }, [previsionsWatch, realisationsWatch, objectifSpecifiqueWatch, setValue]);


  // const gridLayout = isTrimestriel
  //   ? "grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_50px]"
  //   : "grid-cols-[70px_1fr_1fr_1fr_70px]";

  const colContainerClass = "border-l border-slate-100 p-4 space-y-3 w-full h-full flex flex-col";
  const itemBoxClass = "flex items-center gap-2 bg-white p-3 border border-slate-200 rounded-lg shadow-sm w-full relative group/item"; 
  const textAreaClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 resize-none min-h-[100px] p-2 placeholder:text-slate-300 text-center placeholder:text-center flex items-center justify-center";
  // Classe ajustée pour le select afin d'éviter le min-h-[100px] qui ferait un select trop grand
  const selectClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 p-2 cursor-pointer text-center";
  const inputClass = "w-full text-sm text-slate-600 bg-transparent border-none focus:ring-0 min-h-[100px] p-2 placeholder:text-slate-300 text-center placeholder:text-center flex items-center justify-center";
  const addBtnClass = "w-full py-2 mt-auto border border-dashed border-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all";
  const closeBtnClass = "text-slate-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50";

  return (
    <div className={`grid ${gridLayout} ${isTrimestriel ? 'min-w-[2100px]' : 'w-full'} group/row bg-white border border-slate-200 rounded-xl shadow-sm transition-colors hover:border-blue-200 items-stretch overflow-hidden`}>
      
      {/* 1. Index */}
      <div className="flex items-center justify-center text-xs font-black text-slate-300 bg-slate-50/50">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* 2. Action (Titre principal) - MODIFIÉ */}
      <div className={colContainerClass}>
        <div className={itemBoxClass}>
          {isTrimestriel ? (
            <select
              {...register(`lignes.${index}.titre` as any)}
              className={`${selectClass} font-bold text-slate-800`}
            >
              <option value="">Objectif spécifique</option>
              <option value="Hors PTA">Hors PTA</option>
              {objectifSpecifiques.map((obj: ObjectifSpecifique) => (
                // ⚠️ Assure-toi que obj.id et obj.libelle correspondent à ton schéma réel
                <option key={obj.id} value={obj.nom}>
                  {obj.nom} 
                </option>
              ))}
            </select>
          ) : (
            <textarea
              {...register(`lignes.${index}.titre` as any)}
              className={`${textAreaClass} font-bold text-slate-800`}
              placeholder="Nom de l'activité..."
            />
          )}
        </div>
      </div>

      {/* 3. Activité (Effets) - MODIFIÉ */}
      <div className={colContainerClass}>
        {effectsFields.map((field, i) => (
          <div key={field.id} className={itemBoxClass}>
            {isTrimestriel ? (
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
                    {...register(`lignes.${index}.effects.${i}.value` as any)}
                    className={selectClass}
                  >
                    <option value="">Logique d'intervention</option>
                    {logiqueInterventions.map((logique: LogiqueIntervention) => (
                      // ⚠️ Assure-toi que logique.id et logique.libelle correspondent à ton schéma réel
                      <option key={logique.id} value={logique.nom}>
                        {logique.nom}
                      </option>
                    ))}
                  </select>
                )}
              </>
            ) : (
              <textarea 
                {...register(`lignes.${index}.effects.${i}.value` as any)} 
                className={textAreaClass} 
                placeholder={`Effet ${i + 1}...`} 
              />
            )}
            
            {effectsFields.length > 1 && (
              <button type="button" onClick={() => removeEffect(i)} className={closeBtnClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}
        {!isTrimestriel && (
          <button type="button" onClick={() => appendEffect({ value: "" })} className={addBtnClass}>
            + effet
          </button>
        )}
      </div>

      {/* 4. Activité PTA (Impacts) */}
      <div className={colContainerClass}>
        {impactsFields.map((field, i) => (
          <div key={field.id} className={itemBoxClass}>
            <textarea {...register(`lignes.${index}.impacts.${i}.value` as any)} className={textAreaClass} placeholder={isTrimestriel ? `Activité` : `Impact ${i + 1}...`} />
            {impactsFields.length > 1 && (
              <button type="button" onClick={() => removeImpact(i)} className={closeBtnClass}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        ))}
        {/* <button type="button" onClick={() => appendImpact({ value: "" })} className={addBtnClass}>+ {isTrimestriel ? "activité PTA" : "impact"}</button> */}
        {!isTrimestriel && (
          <button type="button" onClick={() => appendImpact({ value: "" })} className={addBtnClass}>
            + impact
          </button>
        )}
      </div>

      {/* Champs Trimestriels */}
      {isTrimestriel && (
        <>
          {/* 5. Produits */}
          <div className={colContainerClass}>
            {produitsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                <input type="text" {...register(`lignes.${index}.produits.${i}.value` as any)} className={inputClass} placeholder={`Produit`} required />
                {produitsFields.length > 1 && (
                  <button type="button" onClick={() => removeProduit(i)} className={closeBtnClass}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
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
                  <input type="number" {...register(`lignes.${index}.cibles.${i}.value` as any)} className={inputClass} placeholder={`0`} min="1" />
                )}
                {ciblesFields.length > 1 && (
                  <button type="button" onClick={() => removeCible(i)} className={closeBtnClass}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
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
                    {...register(`lignes.${index}.previsions.${i}.value` as any)} 
                    className={inputClass} 
                    placeholder="0" 
                  />
                )}
              </div>
            ))}
          </div>

          {/* 7.5. Réalisations */}
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
                    {...register(`lignes.${index}.realisations.${i}.value` as any)} 
                    className={inputClass} 
                    placeholder="0" 
                  />
                )}
              </div>
            ))}
          </div>

          {/* 8. Taux (Calculé automatiquement à l'affichage) */}
          <div className={colContainerClass}>
            {tauxFields.map((field, i) => {
              const valeurTaux = objectifSpecifiqueWatch === "Hors PTA" ? "Hors PTA" : calculerTaux(i);
              return (
                <div key={field.id} className={`${itemBoxClass} bg-slate-50 border-blue-100`}>
                    <input
                      type="text"
                      {...register(`lignes.${index}.taux.${i}.value` as any, { value: "Hors PTA" })}
                      className={`${textAreaClass} font-bold text-blue-600 pointer-events-none`}
                      readOnly
                    />
                  
                  {objectifSpecifiqueWatch !== "Hors PTA" && (
                    <span className="text-[10px] font-bold text-blue-400 absolute right-2 top-1/2 -translate-y-1/2">%</span>
                  )}
                </div>
              );
            })}
          </div>
          {/* <div className={colContainerClass}>
            {tauxFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                <textarea {...register(`lignes.${index}.taux.${i}.value` as any)} className={textAreaClass} placeholder={`Taux ${i + 1}...`} />
                {tauxFields.length > 1 && (
                  <button type="button" onClick={() => removeTaux(i)} className={closeBtnClass}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))} */}
            {/* <button type="button" onClick={() => appendTaux({ value: "" })} className={addBtnClass}>+ taux</button> */}
          {/* </div> */}


          {/* 9. Observations */}
          <div className={colContainerClass}>
            {observationsFields.map((field, i) => (
              <div key={field.id} className={itemBoxClass}>
                <textarea {...register(`lignes.${index}.observations.${i}.value` as any)} className={textAreaClass} placeholder={`Observation ${i + 1}...`} />
                {observationsFields.length > 1 && (
                  <button type="button" onClick={() => removeObservation(i)} className={closeBtnClass}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => appendObservation({ value: "" })} className={addBtnClass}>+ observation</button>
          </div>
        </>
      )}

      {/* 10. Bouton de suppression global */}
      <div className="border-l border-slate-100 flex items-center justify-center p-3 bg-slate-50/50">
        <button
          type="button"
          onClick={() => remove(index)}
          disabled={!canRemove}
          className="p-2.5 rounded-full transition-all text-red-300 hover:text-red-600 hover:bg-red-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};