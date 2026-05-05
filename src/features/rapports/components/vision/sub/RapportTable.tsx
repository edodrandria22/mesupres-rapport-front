"use client";

import React from "react";
import { ApiRapport, ApiActivite, BaseNom } from "../../../types";

interface RapportTableProps {
    rapport: ApiRapport;
    isPdf?: boolean;
}

interface ExtendedApiActivite extends ApiActivite {
    produits?: BaseNom[];
    cibles?: BaseNom[];
    previsions?: BaseNom[];
    realisations?: BaseNom[];
    taux?: BaseNom[];
    observations?: BaseNom[];
}

const formatDateStr = (dateStr?: string) => {
    if (!dateStr) return { day: "", month: "", year: "" };
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString("fr-FR", { month: "long" }).toUpperCase();
    const year = d.getFullYear();
    return { day, month, year };
};

const formatPeriode = (rapport: ApiRapport) => {
    const d1 = formatDateStr(rapport.calendrier?.dateDebut);
    const d2 = formatDateStr(rapport.calendrier?.dateFin);

    if (!d1.day || !d2.day) return "N/A";

    if (d1.month === d2.month && d1.year === d2.year) {
        return `DU ${d1.day} AU ${d2.day} ${d2.month} ${d2.year}`;
    } else if (d1.year === d2.year) {
        return `DU ${d1.day} ${d1.month} AU ${d2.day} ${d2.month} ${d2.year}`;
    } else {
        return `DU ${d1.day} ${d1.month} ${d1.year} AU ${d2.day} ${d2.month} ${d2.year}`;
    }
};

export const RapportTable: React.FC<RapportTableProps> = ({ 
    rapport, 
    isPdf = true 
}) => {
    const entityName = rapport.user?.entite || "DIRECTION DES SYSTÈMES D'INFORMATION ET DES NOUVELLES TECHNOLOGIES (DSINT)";
    const periodeStr = formatPeriode(rapport);
    
    const isTrimestriel = 
        rapport?.calendrier?.typeCalendrier?.id === 3 || rapport?.calendrier?.typeCalendrier?.id === 4;
    
    const idTypeCalendrier = rapport?.calendrier?.typeCalendrier?.id;
    const headers = idTypeCalendrier === 3 
    ? ["Objectif spécifique", "Logique d'intervention", "Activité PTA", "Produit", "Cible", "Prévision Trim.", "Réalisation Trim.", "Taux de réalisation", "Observation"]
    : idTypeCalendrier === 4
    ? ["Objectif spécifique", "Logique d'intervention", "Activité PTA", "Produit", "Cible", "Prévision annuel", "Réalisation annuel", "Taux de réalisation", "Observation"]
    : ["Titre de l'activité", "Effets", "Impacts"];


    
    const colSpanCount = headers.length;

    // Réduction de la taille pour forcer l'ajustement sur PDF
    const tableFontSize = isTrimestriel ? "8px" : "11px"; 
    const cellPadding = isTrimestriel ? "4px 6px" : "12px"; 

    // Fonction utilitaire pour le rendu des cellules contenant des listes
    let apoitra = isPdf;
    if (isTrimestriel) {
        apoitra = false;
    }
    const renderListCell = (items?: BaseNom[], showPoint: boolean = true) => (
        <td style={{ 
            border: "1px solid black", 
            padding: cellPadding, 
            verticalAlign: "top",
            wordBreak: "break-word", // Force le texte à aller à la ligne au lieu de pousser la colonne
            overflowWrap: "break-word"
        }}>
            {items && items.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                    {items.map((item: BaseNom, i: number) => (
                        <li key={i} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                            {showPoint && <span style={{ color: "#000000", fontWeight: "bold" }}>•</span>}
                            <span style={{ textAlign: "justify", color: "#000000" }}>{item.name}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <span style={{ color: "#666666", fontStyle: "italic", fontSize: tableFontSize }}> </span>
            )}
        </td>
    );

    // Fonction spéciale pour afficher le taux avec le symbole %
    const renderTauxCell = (items?: BaseNom[]) => (
        <td style={{ 
            border: "1px solid black", 
            padding: cellPadding, 
            verticalAlign: "top",
            wordBreak: "break-word",
            overflowWrap: "break-word"
        }}>
            {items && items.length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                    {items.map((item: BaseNom, i: number) => (
                        <li key={i} style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                            {isPdf && !isTrimestriel && <span style={{ color: "#000000", fontWeight: "bold" }}>•</span>}
                            <span style={{ textAlign: "justify", color: "#000000" }}>{item.name}</span>
                            {i === items.length - 1 && !isNaN(parseFloat(item.name)) && <span style={{ color: "#000000", fontWeight: "bold" }}> %</span>}
                        </li>
                    ))}
                </ul>
            ) : (
                <span style={{ color: "#666666", fontStyle: "italic", fontSize: tableFontSize }}> </span>
            )}
        </td>
    );

    return (
        <div className="w-full" style={{ 
            maxHeight: isTrimestriel && isPdf ? "100%" : "100%", 
            overflow: "hidden" 
        }}>
            <table
                className="w-full bg-white"
                style={{ 
                    borderCollapse: "collapse", 
                    tableLayout: "fixed", // IMPORTANT: Oblige le tableau à respecter la largeur à 100%
                    fontSize: tableFontSize, 
                    border: "1px solid black",
                    width: "100%", // Reste dans les limites de la page
                    maxWidth: "100%",
                    height: "auto", // Permet au tableau de s'adapter verticalement
                    maxHeight: "100%", // Ne dépasse pas le conteneur parent
                    wordSpacing: "0.5px", // Force l'espacement entre les mots
                    letterSpacing: "0.2px" // Espacement entre les lettres
                }}
            >
                <thead>
                    <tr>
                        <th
                            colSpan={colSpanCount}
                            style={{
                                backgroundColor: "#D1E7B9",
                                border: "1px solid black",
                                padding: "12px",
                                textAlign: "center",
                                fontSize: isTrimestriel ? "11px" : "13px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                color: "#000000"
                            }}
                        >
                            {entityName}
                        </th>
                    </tr>

                    <tr>
                        <th
                            colSpan={colSpanCount}
                            style={{
                                backgroundColor: "#E2D1F9",
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: "center",
                                fontSize: isTrimestriel ? "10px" : "12px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                color: "#4A148C"
                            }}
                        >
                            PERIODE {periodeStr}
                        </th>
                    </tr>

                    <tr style={{ backgroundColor: "#BFDBFE", textAlign: "center", fontWeight: "bold", textTransform: "uppercase" }}>
                        {headers.map((header, idx) => {
                            // Distribution des largeurs de colonnes
                            let colWidth = `${100 / colSpanCount}%`;
                            if (isTrimestriel) {
                                // On donne 16% à la première, et les 8 autres se partagent les 84% restants (10.5% chacune)
                                colWidth = idx === 0 ? "16%" : "10.5%";
                            }

                            return (
                                <th 
                                    key={idx} 
                                    style={{ 
                                        border: "1px solid black", 
                                        padding: cellPadding, 
                                        width: colWidth,
                                        color: "#000000",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {header}
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                
                <tbody>
                    {rapport.activites?.map((actData: ApiActivite, idx: number) => {
                        const act = actData as ExtendedApiActivite;
                        return (
                            <tr key={idx}>
                                <td
                                    style={{
                                        border: "1px solid black",
                                        padding: cellPadding,
                                        verticalAlign: "top",
                                        textAlign: "justify",
                                        lineHeight: "1.4",
                                        fontWeight: "bold",
                                        color: "#000000",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word"
                                    }}
                                >
                                    {act.activite?.name || " "}
                                </td>
                                
                                {renderListCell(act.effects,apoitra)}
                                {renderListCell(act.impacts,apoitra)}

                                {isTrimestriel && (
                                    <>
                                        {renderListCell(act.produits,apoitra)}
                                        {renderListCell(act.cibles,apoitra)}
                                        {renderListCell(act.previsions,apoitra)}
                                        {renderListCell(act.realisations,apoitra)}
                                        {renderTauxCell(act.taux)}
                                        {renderListCell(act.observations,isPdf)}
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};