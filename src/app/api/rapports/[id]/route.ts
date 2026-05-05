import { callApiPut } from "@/lib/callApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  return NextResponse.json({ 
    message: `Rapport ${id} récupéré avec succès`,
    id: id
  });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const url = `/rapports/${id}`;

  return await callApiPut(req, url, []);
}