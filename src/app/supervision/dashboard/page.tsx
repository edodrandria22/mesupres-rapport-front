"use client";

import React, { useEffect, useState } from "react";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";

export default function AdminDashboardPage() {
    return (
        <main className="p-6 lg:p-10 max-w-7xl mx-auto">
            <AdminDashboard />
        </main>
    );
}
