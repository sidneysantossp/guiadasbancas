import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedRequestUser(req);

  return NextResponse.json({
    authenticated: Boolean(user?.id),
    user: user || null,
    timestamp: new Date().toISOString(),
  }, {
    headers: buildNoStoreHeaders({ isPrivate: true }),
  });
}
