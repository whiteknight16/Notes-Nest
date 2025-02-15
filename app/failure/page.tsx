"use client";
import { useRouter } from "next/navigation";

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Payment Failed ❌</h1>
      <a
        href="/dashboard/billing"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Try Again
      </a>
    </div>
  );
}
