import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center px-6 bg-gray-100 dark:bg-gray-900">
      {/* Title */}
      <h1 className="text-5xl font-extrabold text-black dark:text-white mb-4">
        Notes<span className="text-primary">Nest</span>
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
        Capture your thoughts, organize your ideas, and keep everything in one
        place. Whether you're brainstorming, making to-do lists, or jotting down
        important reminders, our seamless and intuitive interface makes
        note-taking effortless.
      </p>

      {/* Call to Action */}
      <a href="/dashboard">
        <Button className="mt-6 text-lg px-6 py-3">Get Started</Button>
      </a>
    </div>
  );
}

export default HomePage;
