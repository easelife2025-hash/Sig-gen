"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50 text-center">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-4">Something went wrong</h2>
      <p className="text-slate-500 mb-8 max-w-md">An unexpected error occurred while loading this page. Please try again or return to the dashboard.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Try again
        </Button>
      </div>
    </div>
  );
}
