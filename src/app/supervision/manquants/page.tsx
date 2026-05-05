"use client";

import React, { useEffect, useState } from "react";
import { MissingUsers } from "@/features/admin/components/MissingUsers";

export default function MissingUsersPage() {
 
    return (
        <main className="p-6 lg:p-10 max-w-7xl mx-auto">
            <MissingUsers />
        </main>
    );
}
