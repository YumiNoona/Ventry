import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";

import { encryptToken } from "@ventry/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      console.error("[OAuth Callback] Meta Auth Error:", error);
      return NextResponse.redirect(`${siteUrl}/dashboard/automations?error=auth_denied`);
    }

    const appId = process.env.INSTAGRAM_APP_ID;
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = `${siteUrl}/api/auth/meta/callback`;

    // 1. Exchange Code for Short-Lived User Access Token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`
    );
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("[OAuth Callback] Token Exchange Error:", JSON.stringify(tokenData));
      return NextResponse.redirect(`${siteUrl}/dashboard/automations?error=token_exchange`);
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Upgrade to Long-Lived User Access Token (60 Days)
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
    );
    const longLivedData = await longLivedResponse.json();
    const longLivedUserToken = longLivedData.access_token;

    // 3. Page & Instagram Business Account Discovery
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${longLivedUserToken}`
    );
    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      console.warn("[OAuth Callback] No pages found for user.");
      return NextResponse.redirect(`${siteUrl}/dashboard/automations?error=no_pages`);
    }

    // 4. Persistence: Connect all found Instagram Accounts
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn("[OAuth Callback] No authenticated user found.");
      return NextResponse.redirect(`${siteUrl}/login?error=auth_required`);
    }

    let accountsLinkedCount = 0;

    for (const page of pagesData.data) {
      if (page.instagram_business_account) {
        const igAccountId = page.instagram_business_account.id;
        const pageToken = page.access_token; // This is a Long-Lived Page Token
        const encryptedPageToken = encryptToken(pageToken);

        await prisma.account.upsert({
          where: { platform_externalId: { platform: "instagram", externalId: igAccountId } },
          update: { accessToken: encryptedPageToken },
          create: {
            userId: user.id,
            platform: "instagram",
            externalId: igAccountId,
            accessToken: encryptedPageToken,
          },
        });
        accountsLinkedCount++;
      }
    }

    console.log(`[OAuth Callback] Discovery Complete: ${accountsLinkedCount} accounts linked.`);

    return NextResponse.redirect(`${siteUrl}/dashboard/automations?success=accounts_connected&count=${accountsLinkedCount}`);
  } catch (err) {
    console.error("[OAuth Callback] Critical Error:", err);
    return NextResponse.redirect(`${siteUrl}/dashboard/automations?error=internal_server_error`);
  }
}
