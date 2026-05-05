import { callApiDelete, callApiPut } from "@/lib/callApi";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return callApiPut(req, `rapports/LI/${id}`, ["name"]);
}
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  // On construit l'url "rapports/1" dynamiquement
  return await callApiDelete(request, `/rapports/LI/${id}`);
}
