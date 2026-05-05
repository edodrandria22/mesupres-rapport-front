import { NextRequest } from "next/server";
import { callApiPost } from "@/lib/callApi";

export async function POST(request: NextRequest) {
  const requiredFields = [
    "destinataire","typeRapport","dateLimite"
  ];

  return callApiPost(request, "rapports/envoyer-rappel", requiredFields);
}

