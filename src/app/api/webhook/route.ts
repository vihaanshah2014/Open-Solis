import { NextRequest, NextResponse } from 'next/server';
import Stripe from "stripe";
import { db } from "@/lib/db";
import { $users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("Received event type:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionEvent(event);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event);
        break;
      case "customer.updated":
        await handleCustomerUpdatedEvent(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing ${event.type}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  console.log("Processing checkout.session.completed");
  const session = event.data.object as Stripe.Checkout.Session;
  const customerEmail = session.customer_details?.email;
  const stripeCustomerId = session.customer as string;

  console.log("Customer email:", customerEmail);
  console.log("Stripe customer ID:", stripeCustomerId);

  try {
    const users = await clerkClient.users.getUserList({
      emailAddress: [customerEmail as string],
    });

    if (users.length === 0) {
      console.error("No user found in Clerk with email:", customerEmail);
      return;
    }

    const userId = users[0].id;

    let subscriptionType = 'premium';
    let numberOfClasses = 0;

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const productName = lineItems.data[0]?.description || '';
    if (productName.includes('Lifetime')) {
      subscriptionType = 'lifetime';
    }
    const classesMatch = productName.match(/(\d+)\s*classes/i);
    if (classesMatch) {
      numberOfClasses = parseInt(classesMatch[1], 10);
    }

    const updateData = {
      subscriptionType: subscriptionType,
      stripeCustomerId: stripeCustomerId,
      numberOfClasses: numberOfClasses,
      subscriptionEndDate: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
    };

    console.log("Updating user with data:", updateData);

    const updateResult = await db.update($users)
      .set(updateData)
      .where(eq($users.id, userId))
      .execute();

    console.log("Update result:", updateResult);

    if (updateResult.rowCount === 0) {
      console.error("No user found with ID:", userId);
    }
  } catch (error) {
    console.error("Error in handleCheckoutSessionCompleted:", error);
  }
}

async function handleSubscriptionEvent(event: Stripe.Event) {
  console.log("Processing subscription event");
  const subscription = event.data.object as Stripe.Subscription;
  const stripeCustomerId = subscription.customer as string;

  try {
    const users = await db.select().from($users).where(eq($users.stripeCustomerId, stripeCustomerId)).execute();

    if (users.length === 0) {
      console.error("No user found with Stripe Customer ID:", stripeCustomerId);
      return;
    }

    const user = users[0];

    const updateData = {
      subscriptionType: subscription.status === 'active' ? 'premium' : 'free',
      subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      cancellationDate: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
    };

    console.log("Updating user with data:", updateData);

    const updateResult = await db.update($users)
      .set(updateData)
      .where(eq($users.id, user.id))
      .execute();

    console.log("Subscription update result:", updateResult);
  } catch (error) {
    console.error("Error in handleSubscriptionEvent:", error);
  }
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  console.log("Processing subscription deleted event");
  const subscription = event.data.object as Stripe.Subscription;
  const stripeCustomerId = subscription.customer as string;

  try {
    const users = await db.select().from($users).where(eq($users.stripeCustomerId, stripeCustomerId)).execute();

    if (users.length === 0) {
      console.error("No user found with Stripe Customer ID:", stripeCustomerId);
      return;
    }

    const user = users[0];

    const updateData = {
      subscriptionType: 'free',
      subscriptionEndDate: new Date(),
      cancellationDate: new Date(),
    };

    console.log("Updating user with data:", updateData);

    const updateResult = await db.update($users)
      .set(updateData)
      .where(eq($users.id, user.id))
      .execute();

    console.log("Subscription deletion update result:", updateResult);
  } catch (error) {
    console.error("Error in handleSubscriptionDeleted:", error);
  }
}

async function handleCustomerUpdatedEvent(event: Stripe.Event) {
  console.log("Processing customer updated event");
  const customer = event.data.object as Stripe.Customer;
  const stripeCustomerId = customer.id;

  try {
    const users = await db.select().from($users).where(eq($users.stripeCustomerId, stripeCustomerId)).execute();

    if (users.length === 0) {
      console.error("No user found with Stripe Customer ID:", stripeCustomerId);
      return;
    }

    const user = users[0];

    const updateData = {
      name: customer.name || user.name,
      // Add more fields as needed, for example:
      // hobbies: customer.metadata?.hobbies || user.hobbies,
      // surveyNumber: customer.metadata?.surveyNumber ? parseInt(customer.metadata.surveyNumber, 10) : user.surveyNumber,
    };

    console.log("Updating user with data:", updateData);

    const updateResult = await db.update($users)
      .set(updateData)
      .where(eq($users.id, user.id))
      .execute();

    console.log("Customer update result:", updateResult);
  } catch (error) {
    console.error("Error in handleCustomerUpdatedEvent:", error);
  }
}