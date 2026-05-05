"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminPilotageContextType {
    selectedTypeId: string;
    setSelectedTypeId: (id: string) => void;
    selectedPeriodId: string;
    setSelectedPeriodId: (id: string) => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
}

const AdminPilotageContext = createContext<AdminPilotageContextType | undefined>(undefined);

export const AdminPilotageProvider = ({ children }: { children: ReactNode }) => {
    const [selectedTypeId, setSelectedTypeId] = useState<string>("");
    const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Logique de reset intelligent centralisée
    useEffect(() => {
        setSelectedPeriodId("");
    }, [selectedTypeId]);

    return (
        <AdminPilotageContext.Provider
            value={{
                selectedTypeId,
                setSelectedTypeId,
                selectedPeriodId,
                setSelectedPeriodId,
                selectedDate,
                setSelectedDate,
            }}
        >
            {children}
        </AdminPilotageContext.Provider>
    );
};

export const useAdminPilotage = () => {
    const context = useContext(AdminPilotageContext);
    if (context === undefined) {
        throw new Error("useAdminPilotage must be used within an AdminPilotageProvider");
    }
    return context;
};
