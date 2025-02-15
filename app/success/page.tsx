"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    if (userId) {
      axios.post("/api/update-user", { userId });
    }
  }, [userId, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen dark:bg-gray-800">
      <h1 className="text-3xl font-bold text-green-500">
        Payment Successful! 🎉
      </h1>
      <a href="/dashboard" className="mt-4 text-blue-500">
        <Button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go Back to Dashboard
        </Button>
      </a>
    </div>
  );
}
