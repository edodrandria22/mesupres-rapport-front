import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = [
    "id",
  ];

  return callApiPost(request, "rapports/changerValidation", requiredFields);
}

