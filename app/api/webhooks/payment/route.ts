import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/db";
type METADATA = {
  userId: string;
  amount: number;
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY as string;
  const sig = headers().get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  const eventType = event.type;
  if (
    eventType !== "checkout.session.completed" &&
    eventType !== "checkout.session.async_payment_succeeded"
  )
    return new Response("Server Error", {
      status: 500,
    });
  const data = event.data.object;
  const metadata = data.metadata as METADATA;
  const userId = metadata.userId;
  //   const amount = metadata.amount;
  const created = data.created;
  const currency = data.currency;
  const customerDetails = data.customer_details;
  const amount = data.amount_total;
  const transactionDetails = {
    userId,
    created,
    currency,
    customerDetails,
    amount,
  };
  try {
    // database update here
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: transactionDetails?.customerDetails?.id },
    });
    return NextResponse.json(
      { message: "Payment successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
