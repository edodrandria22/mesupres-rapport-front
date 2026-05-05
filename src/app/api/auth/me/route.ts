import { type NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/features/auth/types";

const JWT_SECRET = process.env.JWT_SECRET || "be522869fe20e840db508c9f139d423c";



export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    let payload: User;
    try {
      payload = jwt.verify(token, JWT_SECRET) as User;
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
    
    const user = {
      id: payload.id,
      email: payload.email,
      entite: payload.entite,
      role: payload.role,
    };

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
