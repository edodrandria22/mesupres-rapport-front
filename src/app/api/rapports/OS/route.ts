import { NextRequest } from "next/server";
import { callApiPost, callApiGet } from "@/lib/callApi";

export async function GET(request: NextRequest) {
  return callApiGet(request, "rapports/OS");
}

export async function POST(request: NextRequest) {
  const requiredFields = ["name"];
  return callApiPost(request, "rapports/OS", requiredFields);
}
