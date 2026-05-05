import { NextRequest } from 'next/server';
import { callApiGet } from '@/lib/callApi';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idCalendrier = searchParams.get('idCalendrier');

    if (!idCalendrier) {
        return Response.json({ error: "idCalendrier est requis" }, { status: 400 });
    }

    // Proxy vers le backend Symfony
    return await callApiGet(request, '/utilisateurs/calendrierRetard', ['idCalendrier']);
}
