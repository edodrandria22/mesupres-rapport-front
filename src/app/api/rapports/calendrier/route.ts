import { NextRequest } from "next/server";
import { callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  const allowParams= ["idCalendrier"];
  return callApiGet(request, "rapports/calendrier", allowParams);
}