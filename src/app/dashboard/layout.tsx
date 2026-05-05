import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

/**
 * Layout pour toutes les pages du dashboard (protégées).
 * Utilise désormais la structure Sidebar + Navbar épurée.
 */
export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
