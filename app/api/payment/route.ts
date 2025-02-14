import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { metadata } from "../../layout";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  typescript: true,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        line_items: [
          {
            price: amount,
            quantity: 1,
          },
        ],
        mode: "payment",
        currency: "inr",
        success_url: `${process.env.NEXT_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
        metadata: { userId, amount },
      });
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}
