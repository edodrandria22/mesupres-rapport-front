import { NextRequest, NextResponse } from "next/server";
import { callApiGet, callApiPost, callApiPut } from "@/lib/callApi";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
        return callApiGet(request, `utilisateurs/${id}`);
    }

    return callApiGet(request, "utilisateurs");
}

export async function POST(request: NextRequest) {
    const requiredFields = ["email", "mdp", "idRole", "entite", "rang"];
    return callApiPost(request, "utilisateurs", requiredFields);
}

export async function PUT(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID de l'utilisateur requis pour la modification" }, { status: 400 });
    }

    const requiredFields = ["email", "entite", "idRole", "rang"];
    return callApiPut(request, `utilisateurs/${id}`, requiredFields);
}