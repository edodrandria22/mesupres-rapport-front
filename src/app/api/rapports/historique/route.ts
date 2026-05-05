import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
    const allowParams = ["idUtilisateur", "idCalendrier"];
    return callApiGet(request, "rapports/historique", allowParams);
}
