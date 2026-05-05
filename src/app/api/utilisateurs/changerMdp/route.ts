import { NextRequest, NextResponse } from "next/server";
import { callApiGet, callApiPost, callApiPut } from "@/lib/callApi";

export async function POST(request: NextRequest) {
    const requiredFields = ["mdp"];
    return callApiPost(request, "utilisateurs/changerMdp", requiredFields);
}
