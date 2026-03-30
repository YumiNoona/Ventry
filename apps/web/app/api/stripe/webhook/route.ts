import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ventry/db";

// Using a placeholder stub for stripe as requested: /api/stripe/webhook
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ message: "Missing sig or secret" }, { status: 400 });
    }

    // In a real app we'd construct the stripe event here
    const eventParams = JSON.parse(rawBody);

    if (eventParams.type === 'checkout.session.completed') {
      const session = eventParams.data.object;
      
      // Update DB
      if (session.customer && session.client_reference_id) {
         await prisma.user.update({
           where: { id: session.client_reference_id },
           data: {
             stripeCustomerId: session.customer as string,
             subscriptionStatus: 'active'
           }
         });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: \${err.message}\` }, { status: 400 });
  }
}
