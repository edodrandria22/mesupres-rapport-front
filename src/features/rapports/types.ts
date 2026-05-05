/**
 * Structure pour le couple Effet / Impact dans l'API réelle.
 */
import { CalendarPeriod } from "./types/calendrier/calendrierType";
import { User } from "../auth/types";
export interface BaseNom {
    id?: number;
    name: string;
}


/**
 * Structure d'une activité dans l'API réelle.
 */
export interface ApiActivite {
    activite: BaseNom;
    impacts: BaseNom[];
    effects: BaseNom[];
    produits?: BaseNom[];
    cibles?: BaseNom[];
    previsions?: BaseNom[];
    realisations?: BaseNom[];
    taux?: BaseNom[];
    observations?: BaseNom[];
}
/**
 * Structure du rapport renvoyé par l'API (GET data[0]).
 */
export interface ApiRapport {
    id?: number;
    idCalendrier?: number;
    user: User;
    calendrier: CalendarPeriod;
    activites: ApiActivite[];
    statut?: string;
    createdAt?: string;
    deletedAt?: string;
}

/**
 * Interface pour la requête d'enregistrement (POST).
 */
export interface CreateRapportRequest {
    idCalendrier: number;
    activites: ApiActivite[];
}

/**
 * Version "aplatie" utilisée par l'UI interne (Compatibilité).
 */
export interface RapportConsolide {
    id: string;
    dateDebut: string;
    dateFin: string;
    dateCreation: string;
    entiteId: string;
    entiteNom: string;
    lignes: ApiActivite[]; // On utilise désormais la structure imbriquée
    status: "BROUILLON" | "VALIDE" | "TRANSMIS";
}
