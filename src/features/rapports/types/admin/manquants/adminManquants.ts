import { User } from "@/features/auth/types";
import { CalendarPeriod } from "../../calendrier/calendrierType";

export interface MissingUsersToolbarProps {
    selectedTypeId: string;
    setSelectedTypeId: (val: string) => void;
    selectedPeriodId: string;
    setSelectedPeriodId: (val: string) => void;
    calendrierResult?: any;
}

export interface MissingUsersTableProps {
    users: User[];
    isLoading: boolean;
    calendrierPeriod?: CalendarPeriod;
}