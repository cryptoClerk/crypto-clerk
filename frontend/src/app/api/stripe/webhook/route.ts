import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Payment succeeded:", session.id);
      // TODO: Update user's subscription status in database
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object;
      console.log("Invoice payment succeeded:", invoice.id);
      // TODO: Update subscription renewal date
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      console.log("Invoice payment failed:", invoice.id);
      // TODO: Notify user, downgrade to free tier
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log("Subscription cancelled:", subscription.id);
      // TODO: Downgrade user to free tier
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
