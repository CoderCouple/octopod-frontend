import { NextResponse } from "next/server";

import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { token } = (await request.json()) as { token: string };
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    return NextResponse.json({ valid: true, uid: decodedToken.uid });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
