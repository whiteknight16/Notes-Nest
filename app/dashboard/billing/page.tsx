"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const premiumFeatures = [
  "Change Color Theme",
  "AI-Powered Notes",
  "Cloud Sync",
  "Priority Support",
];

const CheckoutForm = ({
  clientSecret,
  userId,
}: {
  clientSecret: string;
  userId: string;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded. Please try again.");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success?userId=${userId}`,
      },
    });

    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
      router.push("/failure");
    } else if (paymentIntent?.status === "succeeded") {
      router.push(`/success?userId=${userId}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md w-full bg-white dark:text-white dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold text-center mb-4">
        Complete Your Payment
      </h3>
      <PaymentElement />
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default function BillingPage() {
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useKindeBrowserClient();
  const userId = user?.id;

  const createPaymentIntent = async () => {
    if (!userId) {
      alert("Please log in to continue.");
      return;
    }

    try {
      const { data } = await axios.post("/api/create-payment", {
        amount: 200,
        userId,
      });
      setClientSecret(data.clientSecret);
    } catch (err) {
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 px-4">
      {!clientSecret ? (
        <div className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Unlock Premium</h2>
          <p className="text-gray-500 text-center mb-4">
            Get these exclusive features for just ₹200
          </p>

          <ul className="space-y-3 mb-6">
            {premiumFeatures.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="text-green-500 w-5 h-5" />
                {feature}
              </li>
            ))}
          </ul>

          <Button onClick={createPaymentIntent} className="w-full">
            Buy Now
          </Button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} userId={userId} />
        </Elements>
      )}
    </div>
  );
}
