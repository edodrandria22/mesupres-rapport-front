import { NextRequest } from "next/server";
import { callApiPost , callApiGet } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = [
    "idCalendrier",
  ];

  return callApiPost(request, "rapports", requiredFields);
}

export async function GET(request: NextRequest) {
  return callApiGet(request, "rapports");
}
