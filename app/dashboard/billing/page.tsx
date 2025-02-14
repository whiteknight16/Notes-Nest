"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const BillingPage = () => {
  const { getUser } = useKindeBrowserClient();
  const user = getUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!user?.id) {
      return alert("You need to be logged in to make a payment");
    }

    setLoading(true);

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    );
    if (!stripe) return alert("Stripe failed to initialize");

    try {
      const response = await axios.post("/api/payment", {
        userId: user.id,
        amount: 200,
      });
      const data = response.data;
      console.log("data", data);
      if (!data.ok) return alert("Something went wrong");
      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
      //   if (error) {
      //     console.error("Payment Error:", error);
      //     router.push("/payment-failed"); // Redirect on failure
      //   } else {
      //     await axios.post("/api/payment/success", { userId: user.id });
      //     router.push("/payment-success"); // Redirect on success
      //   }
    } catch (error) {
      console.error("Payment Error:", error);
      router.push("/payment-failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 w-full">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Lifetime Access
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Pay once and get lifetime access to premium features, including:
          </p>
          <ul className="text-gray-600 dark:text-gray-400 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} /> Change Color
              Scheme
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} /> Exclusive
              Features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={16} /> Priority
              Support
            </li>
          </ul>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹200
          </p>
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="mt-4 w-full"
          >
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
