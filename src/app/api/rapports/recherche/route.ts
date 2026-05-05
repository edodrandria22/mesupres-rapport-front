import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
    const allowParams = ["date"];
    return callApiGet(request, "rapports/recherche", allowParams);
}
