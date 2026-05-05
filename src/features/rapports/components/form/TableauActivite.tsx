import React from "react";
import { Control, UseFormRegister, UseFieldArrayRemove, UseFormSetValue } from "react-hook-form";
import { LigneActivite } from "./LigneActivite"; // Ajustez le chemin
import { ObjectifSpecifique } from "@/features/admin/type/objectifSpecifique/objectifSpecifiqueSchema";
import { LogiqueIntervention } from "@/features/admin/type/logiqueIntervention/logiqueInterventionSchema";

interface TableauActivitesProps {
  fields: Record<"id", string>[];
  control: Control<any>;
  register: UseFormRegister<any>;
  remove: UseFieldArrayRemove;
  isTrimestriel?: number;
  objectifSpecifiques?: ObjectifSpecifique[];
  logiqueInterventions?: LogiqueIntervention[];
  setValue: UseFormSetValue<any>;
}

const TableauActivites: React.FC<TableauActivitesProps> = ({ 
  fields, 
  control, 
  register, 
  remove, 
  isTrimestriel = 0,
  objectifSpecifiques = [],
  logiqueInterventions = [],
  setValue
}) => {
  const isTrim = isTrimestriel === 3 || isTrimestriel === 4;
  
  const headers = isTrimestriel === 3 
    ? ["#", "Objectif spécifique", "Logique d'intervention", "Activité", "Produit", "Cible", "Prévision Trim.", "Réalisation Trim.", "Taux de réalisation", "Observation", ""]
    : isTrimestriel === 4
    ? ["#", "Objectif spécifique", "Logique d'intervention", "Activité", "Produit", "Cible", "Prévision annuel", "Réalisation annuel", "Taux de réalisation", "Observation", ""]
    : ["#", "Titre de l'activité", "Effets", "Impacts", ""];

  // 1. CORRECTION DES COLONNES : Distribution optimisée pour le mode trimestriel
  const gridLayout = isTrim
    ? "grid-cols-[70px_1.5fr_1.5fr_1.5fr_1.5fr_0.8fr_0.8fr_0.8fr_0.8fr_1.5fr_70px]" // Meilleure répartition
    : "grid-cols-[70px_1fr_1fr_1fr_70px]";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        {/* 2. CORRECTION DE L'ESPACE : Ajustement pour correspondre au layout */}
        <div className={isTrim? "min-w-[2100px]" : "min-w-[1000px]"}>

          {/* En-têtes dynamiques */}
          <div className={`grid ${gridLayout} bg-slate-50/80 border-b border-slate-200 items-stretch`}>
            {headers.map((header, idx) => (
              <div 
                key={idx} 
                className={`p-4 text-[10px] font-black tracking-widest uppercase flex items-center ${
                  idx === 0 || idx === headers.length - 1 
                    ? "justify-center text-slate-400" 
                    : "text-slate-600 border-l border-slate-200/50"
                }`}
              >
                {header}
              </div>
            ))}
          </div>

          {/* Liste des lignes */}
          <div className="flex flex-col gap-6 py-4 bg-slate-50/30">
            {fields.map((field, index) => (
              <LigneActivite
                key={field.id}
                control={control}
                register={register}
                index={index}
                remove={remove}
                isTrimestriel={isTrim}
                canRemove={fields.length > 1}
                objectifSpecifiques={objectifSpecifiques}
                logiqueInterventions={logiqueInterventions}
                setValue={setValue}
                gridLayout={gridLayout}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TableauActivites;