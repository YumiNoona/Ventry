import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!appId || !baseUrl) {
    console.error("[OAuth Login] Missing environment variables");
    return NextResponse.json({ error: "OAuth configuration missing" }, { status: 500 });
  }

  const redirectUri = `${baseUrl}/api/auth/meta/callback`;
  
  // Scopes required for Ventry functionality
  const scopes = [
    "instagram_basic",
    "pages_show_list",
    "pages_read_engagement"
  ].join(",");

  const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`[OAuth] Redirecting to Meta: ${oauthUrl}`);
  }
  
  return NextResponse.redirect(oauthUrl);
}
