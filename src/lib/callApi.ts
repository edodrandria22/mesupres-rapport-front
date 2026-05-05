// lib/apiHandler.ts
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { getServerAxios } from "@/lib/getServerAxios";

export async function callApiGet(
  request: NextRequest,
  url: string,
  allowedParams: string[] = []
) {
  try {
    const api = getServerAxios(request);

    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};

    // Générer automatiquement les paramètres autorisés
    allowedParams.forEach((key) => {
      const value = searchParams.get(key);
      if (value) queryParams[key] = value;
    });

    const response = await api.get(url, { params: queryParams });
    return NextResponse.json(response.data);
  } 
  catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const status = err.response.status || 500;
        const data = err.response.data || {};

        const msg =
          data.message ||
          data.error ||
          (typeof data === "string" ? data : JSON.stringify(data)) ||
          "Erreur interne lors de l'appel au service";

        return NextResponse.json({ error: msg }, { status });
      }

      return NextResponse.json(
        { error: err.message || "Erreur de connexion au service backend." },
        { status: 503 }
      );
    }

    // console.error("Erreur inconnue :", err);
    return NextResponse.json(
      { error: "Erreur interne inconnue du serveur" },
      { status: 500 }
    );
  }
}

export async function callApiPost(
  request: NextRequest,
  url: string,
  requiredFields: string[] = [],
  isFormData: boolean = false // 👈 nouvel argument
) {
  try {
    const api = getServerAxios(request);

    let body: any;
    const missingFields: string[] = [];

    if (isFormData) {
      // ✅ Si FormData
      const formData = await request.formData();
      body = formData;

      for (const field of requiredFields) {
        const value = formData.get(field);

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          missingFields.push(field);
        }
      }
    } else {
      // ✅ Si JSON (comportement normal)
      body = await request.json();

      for (const field of requiredFields) {
        if (
          body[field] === undefined ||
          body[field] === null ||
          body[field] === ""
        ) {
          missingFields.push(field);
        }
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Champs requis manquants ou vide : " +
            missingFields.join(", "),
          error:
            "Champs requis manquants ou vide : " +
            missingFields.join(", "),
          missingFields,
        },
        { status: 400 }
      );
    }

    // 🚀 Envoi vers backend
    const response = await api.post(url, body, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;

      return NextResponse.json(
        { error: msg },
        { status: err.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne inconnue du serveur" },
      { status: 500 }
    );
  }
}

export async function callApiPut(
  request: NextRequest,
  url: string,
  requiredFields: string[] = []
) {
  try {
    const api = getServerAxios(request);

    const body = await request.json();
    const missingFields: string[] = [];

    // Vérification des champs requis
    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Champs requis manquants : " + missingFields.join(", "),
          error: "Champs requis manquants : " + missingFields.join(", "),
          missingFields,
        },
        { status: 400 }
      );
    }

    // Body envoyé tel quel
    const response = await api.put(url, body, {
      headers: { "Content-Type": "application/json" },
    });

    return NextResponse.json(
      { message: "Créé avec succès", data: response.data },
      { status: 201 }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg =
      err.response?.data?.error ||
        err.response?.data?.message ||
        err.message;

      return NextResponse.json(
        { error: msg },
        { status: err.response?.status || 500 }
      );
    }

    console.error("Erreur inconnue sur l'api put:", err);
    return NextResponse.json(
      { error: "Erreur interne inconnue du serveur" },
      { status: 500 }
    );
  }
}
export async function callApiDelete(
  request: NextRequest,
  url: string // Ici, tu passeras l'url complète, ex: "/rapports/1"
) {
  try {
    const api = getServerAxios(request);

    // Appel direct sans params ni body
    const response = await api.delete(url);

    // Retourne les données ou un message de succès par défaut
    return NextResponse.json(
      response.data || { message: "Supprimé avec succès" },
      { status: response.status || 200 }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression";

      return NextResponse.json(
        { error: msg },
        { status: err.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne inconnue du serveur" },
      { status: 500 }
    );
  }
}