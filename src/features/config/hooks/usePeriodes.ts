import { useState, useEffect } from "react";
import { periodeService } from "../services/periodeService"; 
import { CalendrierResult , CalendarPeriod} from "../../rapports/types/calendrier/calendrierType";
export const usePeriodes = (isInsert: boolean= false) => {
    const [data, setData] = useState<CalendarPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPeriods = async () => {
        setIsLoading(true);
        setError(null);
        try {
            var periods: CalendarPeriod[] = [];
            if (isInsert) {
                periods = await periodeService.getPeriodsUtilisateur();
            }
            else {
                periods = await periodeService.getPeriods();
            }
            setData(periods);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des périodes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);
    const result: CalendrierResult = {
        data: data,
        isLoading: isLoading,
        error: error,
        refetch: fetchPeriods
    };

    // On retourne l'objet typé
    return result;
};
export const useCalendrierSupervision =  (date: string) => {
    const [data, setData] = useState<CalendarPeriod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPeriods = async () => {
        setIsLoading(true);
        setError(null);
        try {
            var periods: CalendarPeriod[] = [];
            periods = await periodeService.getCalendrierSupervision(date);
            setData(periods);
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement des périodes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, [date]);
    const result: CalendrierResult = {
        data: data,
        isLoading: isLoading,
        error: error,
        refetch: fetchPeriods
    };

    // On retourne l'objet typé
    return result;
};
export const getByIdCalendrier = (id: number,CalendrierResult: CalendrierResult): CalendarPeriod | undefined => {
    return CalendrierResult.data.find((period) => period.id === id);
};

