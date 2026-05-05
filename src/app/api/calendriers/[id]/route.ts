import { callApiDelete, callApiPut ,callApiGet } from "@/lib/callApi";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return await callApiGet(req, `/calendriers/${id}`);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const url = `/calendriers/${id}`;

  return await callApiPut(req, url, []);
}
// app/api/rapports/[id]/route.ts

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  // On construit l'url "rapports/1" dynamiquement
  return await callApiDelete(request, `/calendriers/${id}`);
}