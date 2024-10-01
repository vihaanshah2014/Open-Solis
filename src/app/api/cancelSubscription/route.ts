import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    // 1. Get the user's Stripe customer ID from your database
    const user = await db.select().from($users).where(eq($users.id, userId)).execute();
    
    if (!user || user.length === 0) {
      console.error("User not found in database with ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stripeCustomerId = user[0].stripeCustomerId;
    console.log("Stripe Customer ID:", stripeCustomerId);

    if (!stripeCustomerId) {
      console.error("No Stripe Customer ID found for user ID:", userId);
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    // 2. Retrieve the customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
    });

    if (subscriptions.data.length === 0) {
      console.error("No active subscriptions found for Stripe Customer ID:", stripeCustomerId);
      return NextResponse.json({ error: "No active subscription found" }, { status: 400 });
    }

    // 3. Cancel the subscription
    const subscription = subscriptions.data[0];
    console.log("Cancelling subscription ID:", subscription.id);
    await stripe.subscriptions.cancel(subscription.id);

    // 4. Update the user's subscription type in your database
    const updateResult = await db.update($users)
      .set({ subscriptionType: 'free' })
      .where(eq($users.id, userId))
      .execute();

    console.log("Subscription type updated to 'free' for user ID:", userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
