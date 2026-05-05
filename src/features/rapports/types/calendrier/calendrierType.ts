export interface TypeCalendrier {
    id?: number;
    name: string;
}

export interface CalendarPeriod {
    id?: number;
    dateDebut: string;
    dateFin: string;
    typeCalendrierId?: number;
    typeCalendrierName?: string;
    typeCalendrier?: TypeCalendrier;
}

export interface CalendrierResult {
    data: CalendarPeriod[];         // Les données filtrées
    isLoading: boolean;             // L'état de chargement (true/false)
    error: string | null;           // Le message d'erreur ou null s'il n'y a pas d'erreur
    refetch: () => Promise<void>;   // La fonction pour recharger les données
}