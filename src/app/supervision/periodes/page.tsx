"use client";

import React, { useState, useEffect } from "react";
import { PeriodForm } from "@/features/admin/components/period/PeriodForm";

export default function PeriodsPage() {

    return (
        <main className="p-6 lg:p-10 max-w-7xl mx-auto">
            <PeriodForm />
        </main>
    );
}
