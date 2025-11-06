import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          role: session.user?.role,
        }
      } : null,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({ 
      authenticated: false,
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
